import React from 'react'
import Navber from '../Components/Navber'
import Header from '../Components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-50 relative overflow-hidden'>
      
      <Navber/>
      <Header/>
    </div>
  )
}

export default Home
