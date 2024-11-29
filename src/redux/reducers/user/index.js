import {createSlice} from '@reduxjs/toolkit';
import {postRegister, postLogin, getProfile, googleLogin} from './api';

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
    resetState: () => initialState,
        setStateByName: (state, action) => {
            state[action.payload.name] = action.payload.value;
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
      state.data = action.payload.data.user; // asumsi payload mengandung { user, token }
      state.token = action.payload.data.token;
      state.isLogin = true;
      state.message = 'Login successful!';
    });
    builder.addCase(postLogin.rejected, (state, action) => {
      state.status = 'failed';
      state.message = action.payload || 'Login failed'; // default message
    });

    //Google Login
    builder.addCase(googleLogin.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(googleLogin.fulfilled, (state, action) => {// action = { type: '', payload: data, meta: {}}
        state.status = 'success';
        state.data = action.payload.data.user;
        state.token = action.payload.data.token;
        state.message = action.payload.message;
        state.isLogin = true;
    });
    builder.addCase(googleLogin.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action);
        state.message = action.payload;
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
export const { resetState, setStateByName } = userSlice.actions; // Action untuk logout dan reset state
export {postLogin, getProfile, postRegister, googleLogin}; // Action untuk panggil API postLogin dan getProfile
export default userSlice.reducer; // User reducer untuk ditambahkan ke store
