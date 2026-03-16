import { configureStore } from '@reduxjs/toolkit';
import marketReducer from './marketSlice';
import userReducer from './userSlice';
import alertsReducer from './alertsSlice';

export const store = configureStore({
  reducer: {
    market: marketReducer,
    user: userReducer,
    alerts: alertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
