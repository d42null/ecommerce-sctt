import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { apiSlice } from '../api/apiSlice';

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
// Login handled via setCredentials dispatch from apiSlice
    builder.addMatcher(
      apiSlice.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    );
     // Update user when user is fetched (e.g. after page reload)
    builder.addMatcher(
        apiSlice.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
            state.user = payload;
            localStorage.setItem('user', JSON.stringify(payload));
        }
    );
  },
});

export const { setCredentials, logOut, setToken } = authSlice.actions;

export default authSlice.reducer;
