import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, UserPlus } from 'lucide-react'

import { cn } from '~/lib/utils'

const MobileMenu = ({ isOpen, navLinks, userMenuLinks, onClose }) => {
  const location = useLocation()
  const isAuthenticated = false
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-40 bg-background/95 backdrop-blur-sm sm:hidden pt-[65.6px] animate-fade-in'>
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
            <button
              className='py-2 px-4 rounded-md border h-10 text-left text-destructive border-destructive hover:bg-destructive/10'
              onClick={() => {
                navigate('/')
                onClose()
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
            <div className='flex flex-col space-y-4 pt-4'>
            <Link to='/login'>
                <button className='inline-flex items-center rounded-md text-sm transition-colors
                  border bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full'>
                <LogIn className='h-5 w-5 mr-3' />
                <span>Đăng nhập</span>
              </button>
            </Link>
            <Link to='/register'>
                <button className='inline-flex items-center rounded-md text-sm transition-colors
                  text-primary-foreground h-10 px-4 py-2 w-full bg-heritage hover:bg-heritage-dark'>
                <UserPlus className='h-5 w-5 mr-3' />
                <span>Đăng ký</span>
              </button>
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}

export default MobileMenu
