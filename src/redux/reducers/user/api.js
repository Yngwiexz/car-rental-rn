import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fungsi untuk pendaftaran pengguna
export const postRegister = createAsyncThunk(
  'user/postRegister', // Mengubah actionType menjadi 'user/postRegister'
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://192.168.1.23:3000/api/v1/auth/signup',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { data: userData } = res.data; // Rename data to userData for clarity
      return userData;
    } catch (e) {
      if (e.response && e.response.data) {
        return rejectWithValue(e.response.data.message);
      } else if (e.message) {
        return rejectWithValue(e.message);
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
      const res = await axios.post(
        'http://192.168.1.23:3000/api/v1/auth/signin',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const { data: userData } = res.data;
      return userData;
    } catch (e) {
      if (e.response && e.response.data) {
        return rejectWithValue(e.response.data.message);
      } else if (e.message) {
        return rejectWithValue(e.message);
      } else {
        return rejectWithValue('Something went wrong');
      }
    }
  }
);

// Fungsi untuk mendapatkan profil pengguna
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://192.168.1.23:3000/api/v1/auth/whoami', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const { data: profileData } = res.data; // Rename data to profileData for clarity
      return profileData;
    } catch (e) {
      if (e.response && e.response.data) {
        return rejectWithValue(e.response.data.message);
      } else if (e.message) {
        return rejectWithValue(e.message);
      } else {
        return rejectWithValue('Something went wrong');
      }
    }
  }
);
