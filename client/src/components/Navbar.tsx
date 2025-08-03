// import React from "react";
import { assets } from "../assets/assets";
import { IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useAppContext from "../context/useAppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const {userData, backendUrl, setUserData, setIsLoggedin} = useAppContext();
  
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + '/api/auth/logout');
      if(data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
      }
    } catch(error) {
      toast.error((error as Error).message)
    }
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if(data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch(error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="w-full bg-transparent flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <div className="flex items-center gap-0">
        <img src={assets.logo} alt="logo" className="w-10 sm:w-12" />
        <h1 className="[font-variant:small-caps] text-gray-800 text-2xl md:text-3xl font-bold">Auth</h1>
      </div>

      {userData ? (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white relative group">
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && 
                <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify email</li>
              }
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
            </ul>
          </div>
        </div>
      ) : (
        <button onClick={() => navigate('/login')} className="flex cursor-pointer items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">
          Login <IoArrowForward />
        </button>
      )}
    </div>
  );
};

export default Navbar;
