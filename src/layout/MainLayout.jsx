import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '~/components/Footer/Footer'
import NavBar from '~/components/NavBar/NavBar'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className='flex-grow'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout
