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
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
    );
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

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;
