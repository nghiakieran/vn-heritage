import { LogIn, UserPlus } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const AuthButton = () => {
  return (
    <>
      <Link to='/login'>
        <button className='flex items-center gap-1.5 text-sm rounded-md px-4 py-2 h-10 hover:text-accent-foreground hover:bg-accent'>
          <LogIn size={20} />
          <span>Đăng nhập</span>
        </button>
      </Link>
      <Link to='/register'>
        <button className='flex items-center gap-1.5 text-sm rounded-md px-4 py-2 h-10 bg-heritage text-primary-foreground hover:bg-heritage-dark'>
          <UserPlus size={20} />
          <span>Đăng ký</span>
        </button>
      </Link>
    </>
  )
}

export default AuthButton
