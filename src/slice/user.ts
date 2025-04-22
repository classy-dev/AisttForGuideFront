import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: -1,
  name: '',
  latestSelectedMenuIdx: -1,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
    },
    setLatestSelectedMenuIdx(state, action) {
      state.latestSelectedMenuIdx = action.payload;
    },
  },
});

export default userSlice;
