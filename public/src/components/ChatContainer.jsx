import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import { fetchMessages, addMessage, sendMessage } from "../features/chat/chatSlice";

export default function ChatContainer({ socket }) {
  const dispatch = useDispatch();
  const { messages, currentChat } = useSelector((state) => state.chat);
  const { currentUser } = useSelector((state) => state.user);
  const scrollRef = useRef();

  useEffect(() => {
    if (currentChat && currentUser) {
      dispatch(fetchMessages({ from: currentUser._id, to: currentChat._id }));
    }
  }, [currentChat, currentUser, dispatch]);

  const handleSendMsg = async (msg) => {
    if (currentChat && currentUser) {
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        msg,
      });
      dispatch(sendMessage({ from: currentUser._id, to: currentChat._id, message: msg }));
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        dispatch(addMessage({ fromSelf: false, message: msg }));
      });
    }
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-gray-800">
      <div className="flex items-center justify-between p-4 bg-gray-200 text-gray-800 border-b">
        <div className="flex items-center gap-4">
          {currentChat && (
            <>
              <img
                className="h-12 w-12 rounded-full"
                src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
                alt="Avatar"
              />
              <h3 className="text-lg font-semibold">{currentChat?.username}</h3>
            </>
          )}
        </div>
        <Logout />
      </div>
      <div className="flex-1 p-4 overflow-auto bg-gray-100">
        {messages.map((message) => (
          <div
            ref={scrollRef}
            key={uuidv4()}
            className={`flex ${message.fromSelf ? "justify-end" : "justify-start"} mb-2`}
          >
            <div
              className={`p-3 rounded-lg max-w-[40%] ${message.fromSelf ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}