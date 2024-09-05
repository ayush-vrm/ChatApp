
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../features/chat/chatSlice';
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
  },
});

export default store; 
