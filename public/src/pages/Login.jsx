import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../utils/APIRoutes";
import { setCurrentUser } from "../features/user/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Username and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, { username, password });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        dispatch(setCurrentUser(data.user));
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="flex flex-col justify-center items-center gap-4 bg-white p-20 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-gray-800 text-2xl font-semibold ">ChatApp</h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-sm">
            <input
              type="text"
              placeholder="username"
              name="username"
              onChange={handleChange}
              className="bg-gray-100 border border-blue-400 p-4 rounded-md text-gray-800 text-lg focus:border-blue-500 outline-none"
            />
            <input
              type="password"
              placeholder="password"
              name="password"
              onChange={handleChange}
              className="bg-gray-100 border border-blue-400 p-4 rounded-md text-gray-800 text-lg focus:border-blue-500 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white py-4 px-8 rounded-md font-bold text-lg uppercase hover:bg-blue-600"
            >
              Log In
            </button>
            <span className="text-gray-800 text-lg">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 font-semibold">Create Account.</Link>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}