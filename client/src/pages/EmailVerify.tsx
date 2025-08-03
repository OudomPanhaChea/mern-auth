import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import useAppContext from '../context/useAppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedin, userData, getUserData} = useAppContext();
  const navigate = useNavigate();
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

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e?.value)
      const otp = otpArray.join('');
      const {data} = await axios.post(backendUrl + '/api/auth/verify-account', {otp});
      if(data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch(error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData, navigate]);

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

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verift OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input 
              type="text" maxLength={1} key={index} required 
              ref={e => {inputRefs.current[index] = e}}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
            />
          ))}
        </div>

        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify
