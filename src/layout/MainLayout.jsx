import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <div>NavBar</div>
      <div>
        <Outlet />
      </div>
      <div>Footer</div>
    </div>
  )
}

export default MainLayout
