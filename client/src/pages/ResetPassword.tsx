import React from "react";
import { CiLock, CiMail } from "react-icons/ci";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import useAppContext from "../context/useAppContext";
import axios from "axios";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;

  const {backendUrl} = useAppContext();

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [isOtpSubmited, setIsOtpSubmited] = useState<boolean>(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    if(input.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if(e.key === 'Backspace' && e.currentTarget.value === '' && index > 0){
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text'); 
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }; 

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});
      if(data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch(error) {
      toast.error((error as Error).message);
    }
  }

  const onSubmitOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e?.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword});
      if(data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch(error) {
      toast.error((error as Error).message);
    }
  }

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

      {/*  enter email  */}
      {!isEmailSent && 
        <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full text-white bg-[#333A5C]">
            <CiMail />
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full rounded-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white">
            Submit
          </button>
        </form>
      }
      
      {/* otp input form */}
      {!isOtpSubmited && isEmailSent &&
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email id.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  key={index}
                  required
                  ref={(e) => {
                    inputRefs.current[index] = e;
                  }}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                />
              ))}
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white">
            Submit
          </button>
        </form>
      }

      {/* enter new password */}
      {isOtpSubmited && isEmailSent && 
        <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            New Password
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full text-white bg-[#333A5C]">
            <CiLock />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
              className="bg-transparent outline-none text-white"
            />
          </div>
          <button className="w-full rounded-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer text-white">
            Submit
          </button>
        </form>
      }
    </div>
  );
};

export default ResetPassword;
