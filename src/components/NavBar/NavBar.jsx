import { useEffect, useRef, useState } from 'react'
import { BookOpen, Headset, Heart, House, Menu, UserPlus, X, Search, Loader2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { cn } from '~/lib/utils'
import AuthButton from './AuthButton'
import UserMenu from './UserMenu'
import NavLinks from './NavLinks'
import MobileMenu from './MobileMenu'
import { selectSearchQuery } from '~/store/selectors/paginationSelectors'
import useDebounce from '~/hooks/useDebounce'
import { setSearchQuery } from '~/store/slices/paginationSlice'

const navLinks = [
  { name: 'Trang chủ', to: '/', icon: <House className='h-5 w-5' /> },
  { name: 'Di tích', to: '/heritages', icon: <BookOpen className='h-5 w-5' /> },
  { name: 'Giới thiệu', to: '/about', icon: <Headset className='h-5 w-5' /> },
]

const userMenuLinks = [
  { name: 'Favorites', to: '/favorites', icon: <Heart className='h-5 w-5' /> },
  { name: 'Profile', to: '/profile', icon: <UserPlus className='h-5 w-5' /> },
]

const NavBar = () => {
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const location = useLocation()
  
  const inputRef = useRef(null)
  const dispatch = useDispatch()
  const searchQuery = useSelector(selectSearchQuery)
  const [searchValue, setSearchValue] = useState(searchQuery)
  const debouncedValue = useDebounce(searchValue, 500)
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
    'fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md h-16',
    {
      'bg-white/80 shadow-sm': isScrolled,
      'bg-transparent': !isScrolled
    }
  )

  const handleClear = () => {
    setSearchValue('')
    inputRef.current?.focus()
  }

  const handleChange = (e) => {
    const searchValue = e.target.value
    if (!searchValue.startsWith(' ')) setSearchValue(searchValue)
  }

  // useEffect(() => {
  //   dispatch(setSearchQuery(debouncedValue))
  // }, [debouncedValue, dispatch])
// Dispatch khi debouncedValue sẵn sàng
  useEffect(() => {
    if (debouncedValue !== searchQuery) {
      dispatch(setSearchQuery(debouncedValue));
    }
  }, [debouncedValue, searchQuery, dispatch]);
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
            {/* Search Bar */}
            <div className='flex relative'>
              <input
                ref={inputRef}
                aria-label='Tìm kiếm'
                placeholder='Tìm kiếm di tích...'
                onChange={handleChange}
                value={searchValue}
                className='border rounded-full w-[150px] sm:w-[200px] pr-8 sm:pr-10 sm:px-5 sm:py-2 px-3 py-2 text-[13px] sm:text-sm focus:border-gray-500 focus:outline-none'
              />
              <button 
                aria-label='Tìm kiếm'
                className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-accent-foreground transition-all active:scale-90'>
                {searchValue ? (
                  <X onClick={handleClear} className='size-5 sm:size-5' />
                ) : (
                  <Search className='size-5 sm:size-5' />
                )}
              </button>
            </div>
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
