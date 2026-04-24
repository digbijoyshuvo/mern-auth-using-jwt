import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContext } from '../Contexts/AppContext';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);
  
  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }
  const handelKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const { data } = await axios.post(backendUrl + '/api/auth/verify-email', {otp})

      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/')
      }else{
        toast.error(data.message);
      }
    } catch (err) {
        toast.error(err.message);

    }
  }

  useEffect(()=>{
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn,userData])

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      

      <form onSubmit={onSubmitHandler} className='relative z-10 bg-white p-8 rounded-lg shadow-md w-96 text-sm border border-gray-200'>
        <h1 className='text-gray-800 text-2xl font-bold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-gray-600'>Enter the 6 digit code sent to your email id.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type="text" maxLength='1' key={index} required
              className='w-12 h-12 bg-gray-100 text-gray-800 text-center text-xl rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200'
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handelKeyDown(e, index)}
            />
          ))}
        </div>
        <button className='w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-[16px] cursor-pointer shadow-md hover:shadow-lg transition-all duration-300'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify
