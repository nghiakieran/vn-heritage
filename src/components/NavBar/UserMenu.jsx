import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'

import { Button } from '~/components/common/ui/Button'

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
      <Link to='/favorites'>
        <Button variant='ghost'>
          <Heart size={20} />
          <span>Favorites</span>
        </Button>
      </Link>
      <div className='relative'>
         <Button onClick={() => setIsOpen(!isOpen)} variant='ghost' size='icon' className='hover:bg-transparent'>
          {
            user?.profileImage ? (
              <img src={user?.profileImage} alt='profile' className='h-9 w-9 rounded-full object-cover hover:opacity-80 transition-opacity' />
            ) : (
              <span className='text-white bg-heritage hover:opacity-80 h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium'>{user?.name?.slice(0, 2).toUpperCase() || 'UN'}</span>
            )
          }
        </Button>
        {
          isOpen && (
            <div className='absolute right-0 mt-2 w-56 border rounded-md shadow-lg bg-background'>
              <div className='px-4 py-2'>
                <p className='text-sm font-medium truncate'>{user?.name}</p>
                <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
              </div>
              <hr className='border-gray-100'/>
              {
                userMenuLinks.map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                     <Button variant='ghost' className='!flex w-full h-full !justify-start' >
                      {item.icon}
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))
              }
              <hr className='border-gray-100' />
              <Button 
                onClick={handleLogout} 
                className='w-full text-destructive hover:text-destructive'
                variant='ghost'
              >
                Logout
              </Button>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default UserMenu
