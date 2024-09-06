import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat } from "../features/chat/chatSlice";

export default function Contacts() {
  const dispatch = useDispatch();
  const { contacts, currentChat } = useSelector((state) => state.chat);
  const { currentUser } = useSelector((state) => state.user);

  const changeCurrentChat = (contact) => {
    dispatch(setCurrentChat(contact));
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <div className="flex items-center justify-center p-4 bg-gray-200 border-b">
        <h3 className="ml-2 text-lg font-semibold">ChatApp</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${
              contact._id === currentChat?._id ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => changeCurrentChat(contact)}
          >
            <img
              className="h-12 w-12 rounded-full"
              src={`data:image/svg+xml;base64,${contact?.avatarImage}`}
              alt="Contact Avatar"
            />
            <h3 className="text-lg">{contact?.username}</h3>
          </div>
        ))}
      </div>
      {currentUser && (
        <div className="flex items-center justify-center p-4 bg-gray-200 border-t">
          <img
            className="h-16 w-16 rounded-full"
            src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
            alt="User Avatar"
          />
          <h2 className="ml-4 text-xl font-semibold">{currentUser.username}</h2>
        </div>
      )}
    </div>
  );
}