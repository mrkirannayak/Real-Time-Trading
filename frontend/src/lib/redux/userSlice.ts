import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  username: string | null;
}

const loadUserFromStorage = (): UserState => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, username: null };
  }
  
  const username = localStorage.getItem('username');
  return {
    isAuthenticated: !!username,
    username,
  };
};

const initialState: UserState = loadUserFromStorage();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.username = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('username', action.payload);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('username');
      }
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
