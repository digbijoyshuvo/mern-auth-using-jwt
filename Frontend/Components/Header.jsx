import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../Contexts/AppContext'
const Header = () => {

    const {userData} = useContext(AppContext);

    return (
        <div className=' flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <img src={assets.hall_icon} alt="" className=' w-36 h-35 mb-6' />
            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hello {userData ? userData.name : 'Students'}! 
                <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
            </h1>
            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to RUET Hall </h2>

            <p className='mb-8 max-w-md'>Let's start with a Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex, maxime.</p>
            <button className='border border-gray-500 rounded-full px-10 py-3 hover:bg-gray-100 transition-all'>Get Started</button>
        </div>
    )
}

export default Header
