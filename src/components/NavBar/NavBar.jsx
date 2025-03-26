import React, { useEffect, useRef, useState } from 'react'
import { BookOpen, Headset, Heart, House, Menu, UserPlus, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { cn } from '~/lib/utils'
import SearchBar from '~/components/NavBar/SearchBar'
import AuthButton from './AuthButton'
import UserMenu from './UserMenu'
import NavLinks from './NavLinks'
import MobileMenu from './MobileMenu'

const NavBar = () => {

  const [searchValue, setSearchValue] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const inputRef = useRef(null)
  const location = useLocation()

  const isAuthenticated = true

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
    'fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md',
    {
      'bg-white/80 shadow-sm': isScrolled,
      'bg-transparent': !isScrolled
    }
  )

  const navLinks = [
    { name: 'Trang chủ', to: '/', icon: <House className='h-5 w-5' /> },
    { name: 'Di tích', to: '/heritages', icon: <BookOpen className='h-5 w-5' /> },
    { name: 'Giới thiệu', to: '/about', icon: <Headset className='h-5 w-5' /> },
  ]

  const userMenuLinks = [
    { name: 'Favorites', to: '/favorites', icon: <Heart className='h-5 w-5' /> },
    { name: 'Profile', to: '/profile', icon: <UserPlus className='h-5 w-5' /> },
  ]

  return (
    <>
      <header className={navbarClasses}>
        <div className='container max-w-7xl mx-auto px-4 sm:px-6 flex justify-between py-4'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <img src='/favicon.svg' alt='logo' className='w-6 h-6' />
            <span className='text-heritage tracking-tight text-xl sm:text-2xl font-medium'>Heritage</span>
          </Link>
          {/* Navigation*/}
          <NavLinks navLinks={navLinks} />
          {/* Search AuthButton */}
          <div className='flex justify-between items-center space-x-4'>
            <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} inputRef={inputRef} />
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
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)} 
              className='inline-flex items-center justify-center sm:hidden
              rounded-md w-9 h-9 hover:text-accent-foreground hover:bg-accent transition-colors' 
              aria-label='Toggle-Menu'
            >
              {
                showMobileMenu ? (<X className='w-5 h-5 text-muted-foreground' />) : 
                  <Menu className='w-5 h-5 text-muted-foreground' />
              }
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        navLinks={navLinks}
        userMenuLinks={userMenuLinks}
        onClose={() => setShowMobileMenu(false)}
      />
    </>
  )
}

export default NavBar
