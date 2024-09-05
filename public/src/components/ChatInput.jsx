import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div className="bg-gray-200 p-4 flex items-center border-t">
      <div className="relative flex items-center gap-2 text-gray-800">
        <BsEmojiSmileFill
          className="text-yellow-500 text-xl cursor-pointer"
          onClick={handleEmojiPickerhideShow}
        />
        {showEmojiPicker && (
          <Picker
            onEmojiClick={handleEmojiClick}
            className="absolute bottom-full bg-white text-gray-800 border border-blue-500"
          />
        )}
      </div>
      <form className="flex flex-1 items-center ml-4" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here"
          className="flex-1 p-2 bg-gray-100 text-gray-800 rounded-l-lg border-none focus:outline-none"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit" className="bg-blue-500 p-2 rounded-r-lg text-white flex items-center justify-center">
          <IoMdSend className="text-xl" />
        </button>
      </form>
    </div>
  );
}