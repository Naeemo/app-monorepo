/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useCallback, useEffect, useRef } from 'react';

import { AppState, AppStateStatus } from 'react-native';

import platformEnv from '@onekeyhq/shared/src/platformEnv';

import backgroundApiProxy from '../../background/instance/backgroundApiProxy';
import { useAppSelector } from '../../hooks/redux';
import { lock } from '../../store/reducers/status';

import { AppLockBypass } from './AppLockBypass';

const NativeUpdator = () => {
  const appState = useRef(AppState.currentState);
  const appLockDuration = useAppSelector((s) => s.settings.appLockDuration);
  const lastActivity = useAppSelector((s) => s.status.lastActivity);

  const onChange = useCallback(
    (nextState: AppStateStatus) => {
      if (AppLockBypass.Singleton.isOK()) {
        return;
      }
      if (appState.current === 'background' && nextState === 'active') {
        const idleDuration = Math.floor(
          (Date.now() - lastActivity) / (1000 * 60),
        );
        const isStale = idleDuration >= appLockDuration;
        if (isStale) {
          backgroundApiProxy.dispatch(lock());
        }
      }
      appState.current = nextState;
    },
    [appLockDuration, lastActivity],
  );
  useEffect(() => {
    // AppState.addEventListener return subscription object in native, but return empty in web
    const subscription = AppState.addEventListener('change', onChange);
    return () => {
      // @ts-ignore
      if (subscription) {
        // @ts-ignore
        subscription?.remove();
      } else {
        AppState.removeEventListener('change', onChange);
      }
    };
  }, [onChange]);
  return <></>;
};

type Status = 'active' | 'background';

const DesktopUpdator = () => {
  const appState = useRef<Status>();
  const appLockDuration = useAppSelector((s) => s.settings.appLockDuration);
  const lastActivity = useAppSelector((s) => s.status.lastActivity);

  const onChange = useCallback(
    (nextState: Status) => {
      if (AppLockBypass.Singleton.isOK()) {
        return;
      }
      if (appState.current === 'background' && nextState === 'active') {
        const idleDuration = Math.floor(
          (Date.now() - lastActivity) / (1000 * 60),
        );
        const isStale = idleDuration >= appLockDuration;
        if (isStale) {
          backgroundApiProxy.dispatch(lock());
        }
      }
      appState.current = nextState;
    },
    [appLockDuration, lastActivity],
  );
  useEffect(
    () => window.desktopApi.onAppState(onChange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange],
  );
  return <></>;
};

export const AppStateUpdater = () => {
  const enableAppLock = useAppSelector((s) => s.settings.enableAppLock);
  const isPasswordSet = useAppSelector((s) => s.data.isPasswordSet);
  if (!enableAppLock || !isPasswordSet) {
    return <></>;
  }
  if (platformEnv.isDesktop) {
    return <DesktopUpdator />;
  }
  return <NativeUpdator />;
};
