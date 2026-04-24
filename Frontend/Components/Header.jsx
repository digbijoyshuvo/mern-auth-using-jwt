import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../Contexts/AppContext'
const Header = () => {

    const {userData} = useContext(AppContext);

    return (
        <div className='relative z-10 flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <div className='bg-white rounded-lg p-8 shadow-md border border-gray-200'>
                <img src={assets.hall_icon} alt="" className='w-36 h-36 mb-6 mx-auto' />
                <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 justify-center text-gray-700'>
                    Hello {userData ? userData.name : 'Students'}! 
                    <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
                </h1>
                <h2 className='text-3xl sm:text-5xl font-bold mb-4 text-blue-600'>
                    Welcome to RUET Hall 
                </h2>
                <p className='mb-8 max-w-md text-gray-600 leading-relaxed'>
                    Let's start with a Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex, maxime.
                </p>
                <button className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'>
                    Get Started
                </button>
            </div>
        </div>
    )
}

export default Header
