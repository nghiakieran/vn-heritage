import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'
import { useSelector } from 'react-redux'

import { cn } from '~/lib/utils'
import { Button } from '~/components/common/ui/Button'
import { selectCurrentUser } from '~/store/slices/authSlice'

const MobileMenu = ({ isOpen, navLinks, userMenuLinks, onClose }) => {
  const location = useLocation()
  const userInfo = useSelector(selectCurrentUser)
  const isAuthenticated = !!userInfo
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-40 bg-background/95 backdrop-blur-sm sm:hidden pt-navbar-mobile animate-fade-in'>
      <nav className='container px-4 py-8 flex flex-col space-y-8'>
        {navLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'p-4 rounded-md transition-colors',
              location.pathname === item.to
                ? 'bg-heritage-light text-heritage font-medium'
                : 'hover:bg-accent hover:text-accent-foreground')}
          >
            <div className='flex items-center space-x-3'>
              {item.icon}
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
        {isAuthenticated ? (
          <>
            {userMenuLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'p-4 rounded-md transition-colors',
                  location.pathname === item.to
                    ? 'bg-heritage-light text-heritage font-medium'
                    : 'hover:bg-accent' )}
              >
                <div className='flex items-center space-x-3'>
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
            <Button variant='destructive' onClick={() => {
              navigate('/')
              onClose()}}
            >
              Đăng xuất
            </Button>
          </>
        ) : (
            <div className='flex flex-col space-y-4 pt-4'>
            <Link to='/login'>
              <Button variant='outline' className='w-full'>
                <LogIn className='h-5 w-5 mr-3' />
                <span>Đăng nhập</span>
              </Button>
            </Link>
            <Link to='/register'>
              <Button className='w-full'>
                <UserPlus className='h-5 w-5 mr-3' />
                <span>Đăng ký</span>
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}

export default MobileMenu
