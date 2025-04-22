import { combineReducers } from 'redux';
import connectedSlice from 'SliceFarm/connected';
import guideSlice from 'SliceFarm/guide';
import messageSlice from 'SliceFarm/messageQueue';
import preferenceSlice from 'SliceFarm/preference';
import userSlice from 'SliceFarm/user';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  preference: preferenceSlice.reducer,
  connected: connectedSlice.reducer,
  guide: guideSlice.reducer,
  messageQueue: messageSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
