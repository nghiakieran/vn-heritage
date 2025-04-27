import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { cn } from '~/lib/utils'
import AuthButton from './AuthButton'
import UserMenu from './UserMenu'
import NavLinks from './NavLinks'
import MobileMenu from './MobileMenu'
import { Button } from '~/components/common/ui/Button'
import SearchBar from './SearchBar'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/slices/authSlice'
import { navLinks, userMenuLinks } from './navData'

const NavBar = () => {
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const location = useLocation()

  const userInfo = useSelector(selectCurrentUser)
  const isAuthenticated = !!userInfo

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Off menu
    setShowMobileMenu(false)
  }, [location.pathname])

  const navbarClasses = cn(
    'fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md h-16',
    {
      'bg-white/80 shadow-sm': isScrolled,
      'bg-transparent': !isScrolled
    }
  )

  // Handle off scroll
  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showMobileMenu])

  return (
    <>
      <header className={navbarClasses}>
        <div className='lcn-container-x flex justify-between py-4'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <img src='/favicon.svg' alt='logo' className='w-6 h-6' />
            <span className='text-heritage tracking-tight text-xl sm:text-2xl font-medium'>Heritage</span>
          </Link>
          {/* Navigation*/}
          <NavLinks navLinks={navLinks} />
          {/* Search AuthButton */}
          <div className='flex justify-between items-center space-x-4'>
            {/* Search Bar */}
            <SearchBar />
            {/* Sub Right Side */}
            <div className='hidden sm:flex gap-3'>
              {
                !isAuthenticated ? (
                  <AuthButton />
                ) : (
                  <UserMenu userMenuLinks={userMenuLinks} />
                )
              }
            </div>
            <Button 
              onClick={() => setShowMobileMenu(!showMobileMenu)} 
              className='sm:hidden'
              aria-label='Toggle-Menu'
              size='icon'
              variant='ghost'
            >
              {
                showMobileMenu ? (<X className='w-5 h-5 text-muted-foreground' />) : 
                  <Menu className='w-5 h-5 text-muted-foreground' />
              }
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      {showMobileMenu && (
        <MobileMenu
          isOpen
          navLinks={navLinks}
          userMenuLinks={userMenuLinks}
          onClose={() => setShowMobileMenu(false)}
        />
      )}
    </>
  )
}

export default NavBar
