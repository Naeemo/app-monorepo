import React, { useCallback } from 'react';
import { Box } from '@onekeyhq/components';
import TokenSelector from '../components/TokenSelector'

import { useNavigation, useSwap } from '../../../hooks'
import type { ValuedToken } from '../../../store/typings';

const Input = () => {
  const navigation = useNavigation()
  const { setIn, output } = useSwap()
  const onPress = useCallback((token: ValuedToken) => {
    setIn(token)
    navigation.goBack()
  }, [navigation])
  return <TokenSelector onPress={onPress} excluded={output}></TokenSelector>;
};

export default Input;
