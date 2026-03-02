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
          toast.error(data.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400'>
      <img onClick={() => navigate('/')}
       src={assets.logo} alt="" className=' absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : "Login"}</h2>
        <p className='text-sm text-center mb-6'>{state === 'Sign Up' ? 'Create Your Account' : "Login to Your Account"}</p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C] '>
              <img src={assets.person_icon} alt="" />
              <input
                onChange={e => setName(e.target.value)}
                value={name}
                className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C] '>
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='bg-transparent outline-none' type="email" placeholder='Email Id' required />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C] '>
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='bg-transparent outline-none' type="password" placeholder='Password' required />
          </div>

          <p 
          onClick={() => navigate('/reset-password')}
          className='mb-4 cursor-pointer text-indigo-600'>Forgot Password? </p>
          <button className='w-full rounded-full py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer'>{state}</button>
        </form>

        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>Already Have an Account?{'   '}
            <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login Here</span>
          </p>
        ) :
          (
            <p className='text-gray-400 text-center text-xs mt-4'>Don't Have an Account?{'   '}
              <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
            </p>
          )}


      </div>
    </div>
  )
}

export default Login
