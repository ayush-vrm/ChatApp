import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
          const response = await axios.post(recieveMessageRoute, {
            from: data._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    if (currentChat) {
      try {
        const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        socket.current.emit("send-msg", {
          to: currentChat._id,
          from: data._id,
          msg,
        });
        await axios.post(sendMessageRoute, {
          from: data._id,
          to: currentChat._id,
          message: msg,
        });

        setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

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
