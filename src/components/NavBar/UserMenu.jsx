import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Heart, Settings } from 'lucide-react'
import { toast } from 'react-toastify'
import { selectCurrentUser } from '~/store/slices/authSlice'

import { Button } from '~/components/common/ui/Button'
import { logOut } from '~/store/slices/authSlice'

const UserMenu = ({ userMenuLinks }) => {
  const currentUser = useSelector(selectCurrentUser)
  const isAdmin = currentUser?.role === 'admin'
  
  const [isOpen, setIsOpen] = useState(false)
  const dropDownRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    try {
      dispatch(logOut())
      toast.success('Đăng xuất thành công!')
      navigate('/')
      setIsOpen(false)
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Đăng xuất thất bại. Vui lòng thử lại!')
    }
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
      {isAdmin && (
        <Link to='/admin'>
          <Button variant='ghost'>
            <Settings size={20} />
            <span>Admin</span>
          </Button>
        </Link>
      )}
      <div className='relative'>
         <Button onClick={() => setIsOpen(!isOpen)} variant='ghost' size='icon' className='hover:bg-transparent'>
          {
            currentUser?.avatar ? (
              <img src={currentUser?.avatar} alt='profile' className='h-9 w-9 rounded-full object-cover hover:opacity-80 transition-opacity' />
            ) : (
              <span className='text-white bg-heritage hover:opacity-80 h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium'>{currentUser?.displayname?.slice(0, 2).toUpperCase() || 'UN'}</span>
            )
          }
        </Button>
        {
          isOpen && (
            <div className='absolute right-0 mt-2 w-56 border rounded-md shadow-lg bg-background'>
              <div className='px-4 py-2'>
                <p className='text-sm font-medium truncate'>{currentUser?.displayname}</p>
                {isAdmin && (
                  <p className='text-xs text-heritage'>Quản trị viên</p>
                )}
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
