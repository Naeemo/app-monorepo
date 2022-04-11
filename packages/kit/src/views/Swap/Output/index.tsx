import React, { useCallback } from 'react';
import { Box } from '@onekeyhq/components';
import TokenSelector from '../components/TokenSelector'

import { useNavigation, useSwap } from '../../../hooks'
import type { ValuedToken } from '../../../store/typings';

const Output = () => {
  const navigation = useNavigation()
  const { setOut, input } = useSwap()
  const onPress = useCallback((token: ValuedToken) => {
    setOut(token)
    navigation.goBack()
  }, [navigation])
  return <TokenSelector onPress={onPress} excluded={input}></TokenSelector>;
};

export default Output;
