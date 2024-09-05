import React from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOut, BiPowerOff } from "react-icons/bi";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center p-2 bg-blue-500 rounded-lg text-white"
    >
      <BiLogOut className="text-xl" />
    </button>
  );
}