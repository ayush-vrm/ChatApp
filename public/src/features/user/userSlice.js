import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAvatarRoute } from '../../utils/APIRoutes';

export const setAvatar = createAsyncThunk(
  'user/setAvatar',
  async ({ userId, image }) => {
    const response = await axios.post(`${setAvatarRoute}/${userId}`, { image });
    return response.data;
  }
);

const initialState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAvatar.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setAvatar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = { ...state.currentUser, ...action.payload };
      })
      .addCase(setAvatar.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setCurrentUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;