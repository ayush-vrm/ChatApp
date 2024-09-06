import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatar } from "../features/user/userSlice";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const { currentUser, status, error } = useSelector((state) => state.user);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 1; i++) {
        const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        const buffer = Buffer.from(response.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      dispatch(setAvatar({ userId: currentUser._id, image: avatars[selectedAvatar] }));
    }
  };

  useEffect(() => {
    if (status === 'succeeded') {
      toast.success("Avatar set successfully", toastOptions);
      navigate("/");
    } else if (status ===  'failed') {
      toast.error("Error setting avatar. Please try again.", toastOptions);
    }
  }, [status, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800">
      {isLoading ? (
        <img src={loader} alt="loader" className="w-16 h-16" />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Choose your avatar</h1>
          <div className="flex gap-4">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`cursor-pointer border p-2 rounded-lg ${selectedAvatar === index ? "border-indigo-500" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img
                  className="w-24 h-24 rounded-full"
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                />
              </div>
            ))}
          </div>
          <button
            onClick={setProfilePicture}
            className="bg-indigo-500 text-white py-2 px-4 mt-6 rounded-lg"
          >
            Set as Profile Picture
          </button>
        </>
      )}
      <ToastContainer />
    </div>
  );
}