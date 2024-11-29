import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../../config/axios";

// Fungsi untuk pendaftaran pengguna
export const postRegister = createAsyncThunk(
  'user/postRegister',
  async (payload, { rejectWithValue }) => {
      try {
          const res = await apiClient.post('/auth/signup', payload);
          const data = res.data;
          return data;
      } catch (e) {
          console.log(e)
          if (e.response.data) {
              return rejectWithValue(e.response.data.message);
          } else {
              return rejectWithValue('Something went wrong');
          }
      }
  }
);

//Fungsi untuk login via Google
export const googleLogin = createAsyncThunk(
  'user/googleLogin',
  async (payload, { rejectWithValue }) => {
      try {
          const res = await apiClient.post('/auth/googleSignIn', payload);
          const data = res.data;
          return data;
      } catch (e) {
          console.log(e)
          if (e.response.data) {
              return rejectWithValue(e.response.data.message);
          } else {
              return rejectWithValue('Something went wrong');
          }
      }
  }
);

// Fungsi untuk login pengguna
export const postLogin = createAsyncThunk(
  'user/postLogin',
  async (payload, { rejectWithValue }) => {
      try {
          const res = await apiClient.post('/auth/signin', payload);
          const data = res.data;
          return data;
      } catch (e) {
          console.log(e)
          if (e.response.data) {
              return rejectWithValue(e.response.data.message);
          } else {
              return rejectWithValue('Something went wrong');
          }
      }
  }
);
// Fungsi untuk mendapata profil pengguna
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (token, { rejectWithValue }) => {
      try {
          const res = await apiClient.post('/auth/whoami', {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
          });
          const { data } = res.data;
          return data;
      } catch (e) {
          if (e.response.data) {
              return rejectWithValue(e.response.data.message);
          } else {
              return rejectWithValue('Something went wrong');
          }
      }
  }
)
