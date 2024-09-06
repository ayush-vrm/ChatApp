import React from "react";
import { useSelector } from "react-redux";

export default function Welcome() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        Welcome, {currentUser?.username}!
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        Select a chat to start messaging
      </p>
      <img
        className="w-32 h-32 rounded-full border-2 border-gray-300"
        src={`data:image/svg+xml;base64,${currentUser?.avatarImage}`}
        alt="user-avatar"
      />
    </div>
  );
}