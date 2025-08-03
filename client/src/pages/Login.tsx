import React, { useState } from "react";
import { assets } from "../assets/assets";
import { RxPerson } from "react-icons/rx";
import { CiLock, CiMail } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useAppContext from "../context/useAppContext";

const Login = () => {
  const [state, setState] = useState<string>("Sign up");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useAppContext();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });

        if(data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if(data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-100 to-purple-100">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-0 absolute left-5 sm:left-20 top-5 w-10 sm:w-12 cursor-pointer"
      >
        <img src={assets.logo} alt="logo" className="w-10 sm:w-12" />
        <h1 className="[font-variant:small-caps] text-gray-800 text-2xl md:text-3xl font-bold">
          Auth
        </h1>
      </div>
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign up" ? "Create account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign up"
            ? "Create your account"
            : "Login to your account!"}
        </p>

        <form onSubmit={(e) => onSubmitHandler(e)}>
          {state === "Sign up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-gray-400">
              <RxPerson />
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                className="placeholder:text-gray-400 outline-none"
              />
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-gray-400">
            <CiMail />
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="placeholder:text-gray-400 outline-none"
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c] text-gray-400">
            <CiLock />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="placeholder:text-gray-400 outline-none"
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium text-white">
            {state}
          </button>
        </form>
        {state === "Sign up" ? (
          <p className="text-gray-400 text-center mt-4 text-xs">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center mt-4 text-xs">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
