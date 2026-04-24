import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Contexts/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate();

  const {backendUrl, setIsLoggedIn , getUserData} = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (evt) =>{
    try{
        evt.preventDefault();

      axios.defaults.withCredentials =true;

        if(state === 'Sign Up'){
          const {data} = await axios.post(backendUrl + '/api/auth/register',
            {name,email,password}
          );
          if(data.success){
            setIsLoggedIn(true);
            navigate('/');
            getUserData();
            toast.success(data.message);
          }else{
            toast.error(data.message);
          }
        }
        else{
           const {data} = await axios.post(backendUrl + '/api/auth/login',
            {email,password}
          );
          if(data.success){
            setIsLoggedIn(true);
            navigate('/');
            getUserData();
            toast.success(data.message);
          }else{
            toast.error(data.message);
          } 
        }
        }catch(err){
          toast.error(err.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gray-50'>
      
      <div className='relative z-10 bg-white p-10 rounded-lg shadow-md w-full sm:w-96 text-gray-800 text-sm border border-gray-200'>
        <h2 className='text-3xl font-bold text-gray-800 text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : "Welcome Back"}</h2>
        <p className='text-sm text-center mb-6 text-gray-600'>{state === 'Sign Up' ? 'Create Your Account' : "Login to Your Account"}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-6 py-3 rounded-lg bg-gray-100 border border-gray-300'>
              <img src={assets.person_icon} alt="" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none text-gray-800 placeholder-gray-500 flex-1' type="text" placeholder='Full Name' required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-6 py-3 rounded-lg bg-gray-100 border border-gray-300'>
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none text-gray-800 placeholder-gray-500 flex-1' type="email" placeholder='Email Id' required />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-6 py-3 rounded-lg bg-gray-100 border border-gray-300'>
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none text-gray-800 placeholder-gray-500 flex-1' type="password" placeholder='Password' required />
          </div>

          <p 
          onClick={() => navigate('/reset-password')}
          className='mb-4 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors duration-200'>Forgot Password?</p>
          <button className='w-full rounded-lg py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300'>{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-600 text-center text-xs mt-4'>Already Have an Account?{'   '}
            <span onClick={() => setState('Login')} className='text-blue-500 cursor-pointer underline hover:text-blue-600 transition-colors duration-200'>Login Here</span>
          </p>
        ) :
          (
            <p className='text-gray-600 text-center text-xs mt-4'>Don't Have an Account?{'   '}
              <span onClick={() => setState('Sign Up')} className='text-blue-500 cursor-pointer underline hover:text-blue-600 transition-colors duration-200'>Sign Up</span>
            </p>
          )}


      </div>
    </div>
  )
}

export default Login
