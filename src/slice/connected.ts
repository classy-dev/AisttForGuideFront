import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IConnectedState {
  isConnected: boolean;
}

export const initialState: IConnectedState = {
  isConnected: false,
};

const connectedSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
  },
});

export default connectedSlice;
