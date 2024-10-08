import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { setCurrentUser } from "../features/user/userSlice";
import { setContacts, setSocket, setCurrentChat } from "../features/chat/chatSlice";
import axios from "axios";

export default function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useRef();
  const { currentUser } = useSelector((state) => state.user);
  const { contacts, currentChat } = useSelector((state) => state.chat);

  useEffect(() => {
    const fetchUser = async () => {
      const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!user) {
        navigate("/login");
      } else {
        dispatch(setCurrentUser(JSON.parse(user)));
      }
    };
    fetchUser();
  }, [navigate, dispatch]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      dispatch(setSocket(socket.current));

      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentUser, dispatch]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            dispatch(setContacts(data));
          } catch (error) {
            console.error("Error fetching contacts:", error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate, dispatch]);

  const handleChatChange = (chat) => {
    dispatch(setCurrentChat(chat));
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-gray-100">
      <div className="h-[85vh] w-[85vw] bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="md:col-span-1 lg:col-span-1 bg-gray-200 p-4 rounded-lg">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
        </div>
        <div className="md:col-span-2 lg:col-span-3 bg-gray-100 p-4 rounded-lg">
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </div>
    </div>
  );
}