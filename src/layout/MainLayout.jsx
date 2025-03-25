import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '~/components/NavBar/NavBar'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className='flex-grow container max-w-7xl mx-auto px-4 sm:px-6 pt-[65.6px] sm:pt-[72px]'>
        <Outlet />
      </div>
      <div>Footer</div>
    </div>
  )
}

export default MainLayout
