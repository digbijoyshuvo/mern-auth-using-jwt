import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../Contexts/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Navber = () => {

  const navigate = useNavigate();
  const {userData, backendUrl,setUserData,setIsLoggedIn } = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if(data.success){
        navigate('/email-verify');
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message);
    }
  }

  const logout = async () => {
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + '/api/auth/logout');
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate('/')
    }catch(err){
      toast.error(err.message);
    }
  }
  return (
    <div className='relative z-20 w-full flex justify-between items-center p-4 sm:p-6 px-24 absolute top-0'>
      <div className='bg-white rounded-lg px-6 py-3 shadow-md border border-gray-200'>
        
      </div>
      {

      userData ? 
      <div className='relative'>
        <div className='w-12 h-12 flex justify-center items-center rounded-full bg-blue-500 text-white font-bold text-lg shadow-md hover:shadow-lg cursor-pointer group'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-14 right-0 z-30 text-black rounded-lg pt-2'>
            <ul className='list-none m-0 p-3 bg-white rounded-lg shadow-md border border-gray-200 min-w-[120px]'> 
              {!userData.isAccountVerified && 
                <li onClick={sendVerificationOtp} className='py-2 px-3 hover:bg-gray-100 cursor-pointer rounded-md transition-colors duration-200 text-sm font-medium'>
                  Verify Email
                </li>
              }
              <li onClick={logout} className='py-2 px-3 hover:bg-red-50 cursor-pointer rounded-md transition-colors duration-200 text-sm font-medium text-red-600'>
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div> :
      <button onClick={ ()=> navigate('/login')}
      className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300'>
        Login 
      </button>

      }
    </div>
  )
}

export default Navber
