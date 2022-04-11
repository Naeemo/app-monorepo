import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Box, Center, Divider, IconButton, Typography, Button } from '@onekeyhq/components';
import {
  ModalRoutes,
  RootRoutes,
  RootRoutesParams
} from '@onekeyhq/kit/src/routes/types';
import { SwapRoutes } from './typings'
import TokenInput from './components/TokenInput';
import { useNavigation, useSwap } from '../../hooks'


const SwapContent = () => {
  const intl = useIntl();
  const { input, output, inputAmount, outputAmount, setInAmount, setOutAmount, quote, setDependentIn } = useSwap();
  const navigation = useNavigation()
  const onInputPress = useCallback(() => {
    navigation.navigate(RootRoutes.Modal, {
      screen: ModalRoutes.Swap,
      params: { 
        screen: SwapRoutes.Input
      }
    })
  }, [navigation])
  const onOutputPress = useCallback(() => {
    navigation.navigate(RootRoutes.Modal, {
      screen: ModalRoutes.Swap,
      params: {
        screen: SwapRoutes.Output
      }
    })
  }, [navigation])
  const onInputChange = useCallback((value: string) => {
    setInAmount(value)
    setDependentIn(true)
  }, [setInAmount, setDependentIn])
  const onOutputChange = useCallback((value: string) => {
    setOutAmount(value);
    setDependentIn(false);
  }, [setDependentIn, setOutAmount])

  return (
    <Center px="4">
      <Box
        bg="surface-default"
        shadow="depth.2"
        maxW="420"
        w="full"
        borderRadius={12}
        px="4"
        py="6"
      >
        <Box borderWidth="0.5" borderColor="border-default" bg='surface-subdued' borderRadius={12}>
          <TokenInput
            label={intl.formatMessage({ id: 'content__from' })}
            token={input}
            inputValue={inputAmount}
            onChange={onInputChange}
            onPress={onInputPress}
          ></TokenInput>
          <Box w="full" h="10" position="relative">
            <Box position="absolute" w="full" h="full">
              <Center w="full" h="full">
                <Divider></Divider>
              </Center>
            </Box>
            <Center>
              <IconButton
                w="10"
                h="10"
                name="SwitchVerticalSolid"
                borderRadius="full"
                borderColor="border-disabled"
                borderWidth="0.5"
                bg="surface-default"
              ></IconButton>
            </Center>
          </Box>
          <TokenInput
            label={intl.formatMessage({ id: 'content__to' })}
            token={output}
            inputValue={outputAmount}
            onChange={onOutputChange}
            onPress={onOutputPress}
          ></TokenInput>
        </Box>
        <Box display='flex' flexDirection='row' justifyContent='space-between' mt='2' mb='4'>
          <Typography.Body2 color='text-subdued'>{intl.formatMessage({ id: 'Rate' })}</Typography.Body2>
          <Typography.Body2 color='text-default'>{ quote ? `1${input?.symbol.toUpperCase()} = ${quote.price}${output?.symbol.toUpperCase()}`: '---' }</Typography.Body2>
        </Box>
        <Button type='primary' isDisabled>{intl.formatMessage({ id: 'title__swap' })}</Button>
      </Box>
    </Center>
  );
};

export default SwapContent;
