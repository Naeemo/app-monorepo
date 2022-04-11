import { useCallback, useEffect, useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import axios from 'axios';

import { useDebounce } from '../hooks';
import {
  useAppSelector,
  useAppDispatch,
  useActiveWalletAccount,
} from './redux';
import {
  setInput,
  setOutput,
  setInputAmount,
  setOutputAmount,
  setDependentInput,
} from '../store/reducers/swap';
import { ValuedToken } from '../store/typings';

export type SwapQuote = {
  price: string;
  guaranteedPrice: string;
  to: string;
  data?: string;
  value?: string;
  gasPrice?: string;
  gas?: string;
  estimatedGas?: string;
  protocolFee?: string;
  minimumProtocolFee?: string;
  buyAmount: string;
  sellAmount: string;
  sources?: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  estimatedGasTokenRefund?: string;
  allowanceTarget: string;
};

type QuestParams = {
  sellToken?: string;
  sellAmount?: string;
  buyToken?: string;
  buyAmount?: string;
  buyTokenPercentageFee?: string;
  takerAddress?: string;
  slippagePercentage: number;
};

const swapClient = axios.create();

const NETWORKS: Record<string, string> = {
  '1': 'https://defi.onekey.so/onestep/api/v1/trade_order/quote?chainID=ethereum',
  '42': 'https://kovan.api.0x.org/swap/v1/quote',
  '56': 'https://defi.onekey.so/onestep/api/v1/trade_order/quote?chainID=bsc',
  '3': 'https://defi.onekey.so/onestep/api/v1/trade_order/quote?chainID=ropsten',
  '128': 'https://0x.onekey.so/swap/v1/quote',
  '137':
    'https://defi.onekey.so/onestep/api/v1/trade_order/quote?chainID=polygon',
  '250':
    'https://defi.onekey.so/onestep/api/v1/trade_order/quote?chainID=fantom',
  '43114':
    'https://defi.onekey.so/onestep/api/v1/trade_order/quote?chainID=avalanche',
};

export function useSwapQuoteBase(): string {
  const { network } = useActiveWalletAccount();
  const chainId = network?.network?.extraInfo?.chainId;
  const index = chainId ? String(+chainId) : '1';
  // Since we have mainnet as fallback,
  // there should be alwasys an url to return
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return NETWORKS[index];
}

export const useSwap = () => {
  const dispatch = useAppDispatch();
  const [quote, setQuote] = useState<SwapQuote>();
  const baseUrl = useSwapQuoteBase();
  const { input, output, dependentInput, inputAmount, outputAmount } =
    useAppSelector((s) => s.swap);
  const params = useMemo<QuestParams>(() => {
    let parsedValue = dependentInput
      ? new BigNumber(inputAmount)
      : new BigNumber(outputAmount);
    let base = new BigNumber(10);
    parsedValue = base
      .exponentiatedBy(
        dependentInput ? input?.decimals ?? 1 : output?.decimals ?? 1,
      )
      .multipliedBy(parsedValue);
    const params = {
      sellToken: input?.tokenIdOnNetwork
        ? input?.tokenIdOnNetwork
        : input?.symbol.toUpperCase(),
      buyToken: output?.tokenIdOnNetwork
        ? output?.tokenIdOnNetwork
        : input?.symbol.toUpperCase(),
      sellAmount: dependentInput ? parsedValue.toString() : undefined,
      buyAmount: dependentInput ? undefined : parsedValue.toString(),
      slippagePercentage: 0.03,
      feeRecipient: '0xc1e92BD5d1aa6e5f5F299D0490BefD9D8E5a887a',
      affiliateAddress: '0x4F5FC02bE49Bea15229041b87908148b04c14717',
    };
    return params;
  }, [input, output, dependentInput, inputAmount, outputAmount]);

  const deboucedParams = useDebounce(params, 1000);

  useEffect(() => {
    async function main() {
      if (!(input && output && (inputAmount || outputAmount))) {
        return;
      }
      const result = await swapClient.get(baseUrl, { params: deboucedParams });
      const quote = result.data.data as SwapQuote;
      if (dependentInput) {
        const value = new BigNumber(quote.buyAmount)
        const base = new BigNumber(10);
        const decimals = new BigNumber(output.decimals)
        setOutAmount(value.div(base.exponentiatedBy(decimals)).toFixed(2))
      } else {
        const value = new BigNumber(quote.sellAmount)
        const base = new BigNumber(10);
        const decimals = new BigNumber(input.decimals)
        setInAmount(value.div(base.exponentiatedBy(decimals)).toFixed(2))
      }
      setQuote(quote);
    }
    main();
  }, [input, output, inputAmount, outputAmount, deboucedParams, baseUrl, dependentInput]);

  const setIn = useCallback(
    (token: ValuedToken) => {
      dispatch(setInput(token));
    },
    [dispatch],
  );
  const setInAmount = useCallback(
    (value: string) => {
      dispatch(setInputAmount(value));
    },
    [dispatch],
  );
  const setOut = useCallback(
    (token: ValuedToken) => {
      dispatch(setOutput(token));
    },
    [dispatch],
  );
  const setOutAmount = useCallback(
    (value: string) => {
      dispatch(setOutputAmount(value));
    },
    [dispatch],
  );
  const setDependentIn = useCallback(
    (value: boolean) => {
      dispatch(setDependentInput(value));
    },
    [dispatch],
  );
  return {
    input,
    output,
    inputAmount,
    outputAmount,
    dependentInput,
    quote,
    setIn,
    setOut,
    setInAmount,
    setOutAmount,
    setDependentIn,
  };
};
