import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ValuedToken } from '../typings';

type SwapState = {
  input?: ValuedToken;
  output?: ValuedToken;
  inputAmount: string;
  outputAmount: string;
  dependentInput: boolean
};

const initialState: SwapState = {
  input: undefined,
  output: undefined,
  inputAmount: "",
  outputAmount: "",
  dependentInput: true,
};

export const slice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setInput(state, action: PayloadAction<ValuedToken>) {
      state.input = action.payload;
    },
    setInputAmount(state, action: PayloadAction<string>) {
      state.inputAmount = action.payload;
    },
    setOutput(state, action: PayloadAction<ValuedToken>) {
      state.output = action.payload;
    },
    setOutputAmount(state, action: PayloadAction<string>) {
      state.outputAmount = action.payload;
    },
    setDependentInput(state, action: PayloadAction<boolean>) {
      state.dependentInput = action.payload
    }
  },
});

export const { setInput, setOutput, setInputAmount, setOutputAmount, setDependentInput } =
  slice.actions;

export default slice.reducer;
