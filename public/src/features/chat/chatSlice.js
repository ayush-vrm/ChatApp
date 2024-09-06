import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { sendMessageRoute, recieveMessageRoute } from '../../utils/APIRoutes';

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ from, to }) => {
    const response = await axios.post(recieveMessageRoute, { from, to });
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ from, to, message }) => {
    await axios.post(sendMessageRoute, { from, to, message });
    return { fromSelf: true, message };
  }
);

const initialState = {
  messages: [],
  currentChat: null,
  socket: null,
  contacts: [],
  status: 'idle',
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { setMessages, addMessage, setCurrentChat, setSocket, setContacts } = chatSlice.actions;
export default chatSlice.reducer;