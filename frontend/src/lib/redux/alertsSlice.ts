import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, Notification } from '../types';

interface AlertsState {
  items: Alert[];
  notifications: Notification[];
}

const initialState: AlertsState = {
  items: [],
  notifications: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.items = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.items.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
    triggerAlert: (state, action: PayloadAction<string>) => {
      const alert = state.items.find(a => a.id === action.payload);
      if (alert) {
        alert.triggered = true;
      }
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    clearNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setAlerts, addAlert, removeAlert, triggerAlert, addNotification, clearNotification, clearAllNotifications } = alertsSlice.actions;
export default alertsSlice.reducer;
