import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  currentChat: null,
  socket: null,
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
  },
});

export const { setMessages, addMessage, setCurrentChat, setSocket } = chatSlice.actions;
export default chatSlice.reducer;
