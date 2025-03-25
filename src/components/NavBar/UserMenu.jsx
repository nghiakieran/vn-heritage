import { Heart } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const UserMenu = ({ userMenuLinks }) => {
  // Fake user
  const user = {
    profileImage: 'https://images.unsplash.com/photo-1742268351424-e845eb0c99a2?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Nghia',
    email: 'lechinghia202@gmail.com'
  }
  
  const [isOpen, setIsOpen] = useState(false)
  const dropDownRef = useRef(null)
  const navigate = useNavigate()

  const handleLogout = () => {
    // Call logout
    navigate('/')
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])
  
  return (
    <div className='flex items-center gap-2' ref={dropDownRef}>
      <Link to='/favorites' className='flex items-center gap-1.5 text-sm hover:text-accent-foreground hover:bg-accent px-4 py-2 h-10 rounded-md'>
        <Heart size={20} />
        <span>Favorites</span>
      </Link>
      <div className='relative'>
        <button onClick={() => setIsOpen(!isOpen)} 
          className='h-9 w-9 rounded-full bg-heritage hover:opacity-80 transition-opacity flex items-center justify-center'>
          {
            user?.profileImage ? (
              <img src={user?.profileImage} alt='profile' className='h-full w-full rounded-full object-cover' />
            ) : (
              <span className='text-white text-sm font-medium'>{user?.name?.slice(0, 2).toUpperCase() || 'UN'}</span>
            )
          }
        </button>
        {
          isOpen && (
            <div className='absolute right-0 mt-2 w-56 border rounded-md shadow-lg'>
              <div className='px-4 py-2'>
                <p className='text-sm font-medium truncate'>{user?.name}</p>
                <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
              </div>
              <hr className='border-gray-100'/>
              {
                userMenuLinks.map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                    <button className='flex items-center w-full h-full gap-1.5 text-sm rounded-md px-4 py-2 hover:text-accent-foreground hover:bg-accent'>
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  </Link>
                ))
              }
              <hr className='border-gray-100' />
              <button onClick={handleLogout} className='w-full py-2 text-sm text-destructive hover:bg-destructive-foreground rounded-md'>Logout</button>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default UserMenu
