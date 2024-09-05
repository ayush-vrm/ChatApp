import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    fetchUser();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-800">
      <div className="flex items-center justify-center p-4 bg-gray-200 border-b">
        <h3 className="ml-2 text-lg font-semibold">ChatApp</h3>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {contacts.map((contact, index) => (
          <div
            key={contact._id}
            className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${index === currentSelected ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => changeCurrentChat(index, contact)}
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
      {currentUserImage && (
        <div className="flex items-center justify-center p-4 bg-gray-200 border-t">
          <img
            className="h-16 w-16 rounded-full"
            src={`data:image/svg+xml;base64,${currentUserImage}`}
            alt="User Avatar"
          />
          <h2 className="ml-4 text-xl font-semibold">{currentUserName}</h2>
        </div>
      )}
    </div>
  );
}
