import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
import { setCurrentUser } from "../features/user/userSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, username, email } = values;
    if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
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
        <div className="flex flex-col justify-center items-center gap-4 bg-white p-12 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-gray-800 text-2xl font-semibold">ChatApp</h1>
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
              type="email"
              placeholder="email"
              name="email"
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
              Create User
            </button>
            <span className="text-gray-800 text-lg">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 font-bold">Login.</Link>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}