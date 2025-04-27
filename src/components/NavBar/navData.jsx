import { BookOpen, Headset, Heart, House, Map, UserPlus } from 'lucide-react'

export const navLinks = [
  { 
    name: 'Trang chủ', 
    to: '/', 
    icon: () => <House className='h-5 w-5' /> 
  },
  { 
    name: 'Di tích', 
    to: '/heritages', 
    icon: () => <BookOpen className='h-5 w-5' /> 
  },
  { 
    name: 'Khám phá', 
    to: '/explore', 
    icon: () => <Map className='h-5 w-5' /> 
  },
  { 
    name: 'Giới thiệu', 
    to: '/about', 
    icon: () => <Headset className='h-5 w-5' /> 
  },
]

export const userMenuLinks = [
  { 
    name: 'Favorites', 
    to: '/favorites', 
    icon: () => <Heart className='h-5 w-5' /> 
  },
  { 
    name: 'Profile', 
    to: '/profile', 
    icon: () => <UserPlus className='h-5 w-5' /> 
  },
] 