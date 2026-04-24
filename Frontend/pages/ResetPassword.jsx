import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Contexts/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);


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

  const onSubmitEmail = async (e) => {
    try {
      e.preventDefault();
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email});

      data.success ? toast.success(data.message) : toast.error(data.message);

      data.success && setIsEmailSent(true);
    } catch (err) {
    toast.error(err.message) 
    }
  }

  const onSubmitOTP = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      setOtp(otpArray.join(''));
      setIsOtpSubmitted(true);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const onSubmitPassword = async (e) => {
    try {
      e.preventDefault();
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword});

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      

      {/* Enter Email Id */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='relative z-10 bg-white p-8 rounded-lg shadow-md w-96 text-sm border border-gray-200'>
          <h1 className='text-gray-800 text-2xl font-bold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-gray-600'>Enter your registered email address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-300'>
            <img src={assets.mail_icon} alt="" className='w-3 h-3' />
            <input type="email" placeholder='Email Id'
              className='bg-transparent outline-none text-gray-800 placeholder-gray-500 flex-1'
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className='w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-[16px] cursor-pointer shadow-md hover:shadow-lg transition-all duration-300'>Send OTP Request</button>
        </form>
      }

      {/* otp input form */}
      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOTP} className='relative z-10 bg-white p-8 rounded-lg shadow-md w-96 text-sm border border-gray-200'>
          <h1 className='text-gray-800 text-2xl font-bold text-center mb-4'>Reset Password OTP</h1>
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
          <button type="submit" className='w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-[16px] cursor-pointer shadow-md hover:shadow-lg transition-all duration-300'>Verify OTP</button>
        </form>
      }
      {/* Enter New Password */}
      {isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitPassword} className='relative z-10 bg-white p-8 rounded-lg shadow-md w-96 text-sm border border-gray-200'>
          <h1 className='text-gray-800 text-2xl font-bold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-gray-600'>Enter the new Password Below</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-300'>
            <img src={assets.lock_icon} alt="" className='w-3 h-3' />
            <input type="password" placeholder='Write Password'
              className='bg-transparent outline-none text-gray-800 placeholder-gray-500 flex-1'
              value={newPassword} onChange={e => setnewPassword(e.target.value)} required />
          </div>
          <button type="submit" className='w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-[16px] cursor-pointer shadow-md hover:shadow-lg transition-all duration-300'>Save New Password</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword
