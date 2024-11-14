import {createSlice} from '@reduxjs/toolkit';
import {postRegister, postLogin, getProfile} from './api';

const initialState = {
  data: null, // Variable untuk menyimpan data user
  token: null,
  isLogin: false,
  status: 'idle', // 'idle' | 'loading' | 'success' | 'failed'
  message: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: state => {
      state.data = null;
      state.isLogin = false;
      state.token = null;
      state.status = 'idle';
      state.message = null;
    },
    resetState: state => {
      return initialState;
    },
  },
  extraReducers: builder => {
    // Post Register Reducers
    builder.addCase(postRegister.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(postRegister.fulfilled, (state, action) => {
      state.status = 'success';
      state.data = action.payload.user; // asumsi payload mengandung { user, token }
      state.token = action.payload.token;
      state.isLogin = true;
      state.message = 'Registration successful!';
    });
    builder.addCase(postRegister.rejected, (state, action) => {
      state.status = 'failed';
      state.message = action.payload || 'Registration failed';
    });

    // Post Login Reducer
    builder.addCase(postLogin.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(postLogin.fulfilled, (state, action) => {
      state.status = 'success';
      state.data = action.payload.user; // asumsi payload mengandung { user, token }
      state.token = action.payload.token;
      state.isLogin = true;
      state.message = 'Login successful!';
    });
    builder.addCase(postLogin.rejected, (state, action) => {
      state.status = 'failed';
      state.message = action.payload || 'Login failed'; // default message
    });

    // Get Profile Reducers
    builder.addCase(getProfile.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.status = 'success';
      state.data = action.payload.user; // asumsi payload mengandung { user }
      state.message = 'Profile fetched successfully!';
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.status = 'failed';
      state.message = action.payload || 'Failed to fetch profile';
    });
  },
});

export const selectUser = state => state.user; // Selector untuk mengambil state user
export const {logout, resetState} = userSlice.actions; // Action untuk logout dan reset state
export {postLogin, getProfile, postRegister}; // Action untuk panggil API postLogin dan getProfile
export default userSlice.reducer; // User reducer untuk ditambahkan ke store
