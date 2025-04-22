import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ISpeechMessage {
  type: 'warning' | 'alert';
  message: string;
  beforeEffect?: boolean;
  effectType?: 'nextstep' | 'complete';
}

export interface IMessageQueueState {
  messages: ISpeechMessage[];
  currentMessage: null | ISpeechMessage;
  pushedCount: number;
  canAlertPush: boolean;
}

const initialState: IMessageQueueState = {
  messages: [],
  currentMessage: null,
  pushedCount: 0,
  canAlertPush: true,
};

const updateWarningMessage = (
  messages: ISpeechMessage[],
  updatedMessage: ISpeechMessage,
  index: number
) => {
  if (index < 0) {
    return messages;
  }
  const copy = [...messages];
  copy[index] = updatedMessage;
  return copy;
};

const messageQueueSlice = createSlice({
  name: 'messageQueue',
  initialState,
  reducers: {
    push(state, action: PayloadAction<ISpeechMessage>) {
      if (action.payload.type === 'warning' && !state.canAlertPush) return;

      const index = state.messages.findIndex(
        message =>
          message.type === 'warning' &&
          message.message === action.payload.message
      );

      if (index > -1) {
        state.messages = updateWarningMessage(
          state.messages,
          action.payload,
          index
        );
        return;
      }

      state.messages = [...state.messages, action.payload];
      state.pushedCount += 1;
      state.canAlertPush = false;
    },
    shift(state) {
      state.currentMessage = state.messages.shift() ?? null;
      state.messages = state.messages.filter(
        message => state.currentMessage !== message
      );
    },
    reset(state) {
      state.messages = [];
      state.pushedCount = 0;
      state.currentMessage = null;
    },
    setAlertPush(state, action: PayloadAction<boolean>) {
      state.canAlertPush = action.payload;
    },
    nextStep(state) {
      state.messages = state.messages.filter(
        message => message.type !== 'warning'
      );
    },
  },
});

export default messageQueueSlice;
