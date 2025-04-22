import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IPreferenceState {
  hostname?: string;
  direction?: string;
  GUIDE_PORT?: number;

  INFERENCE_PORT?: number;
  isDev?: string;
  isWeight?: string;
}

export const initialState: IPreferenceState = JSON.parse(
  localStorage.getItem('aistt-preference') ?? 'null'
) ?? {
  hostname: `${window.location.protocol}//${window.location.hostname}`,
  GUIDE_PORT: 80,
  SCREEN_PORT: 5000,
  isDev: import.meta.env.NODE_ENV === 'development' ? '1' : '0',
  isWeight: '0',
};

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setPreference(state, action: PayloadAction<Partial<IPreferenceState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setPreferenceAndSaveStorage(
      state,
      action: PayloadAction<Partial<IPreferenceState>>
    ) {
      const mergedState = {
        ...state,
        ...action.payload,
      };

      localStorage.setItem('aistt-preference', JSON.stringify(mergedState));

      if (
        state.hostname !== action.payload.hostname ||
        state.GUIDE_PORT !== action.payload.GUIDE_PORT ||
        state.INFERENCE_PORT !== action.payload.INFERENCE_PORT
      ) {
        window?.location?.reload();
      }

      return mergedState;
    },
  },
});

export default preferenceSlice;
