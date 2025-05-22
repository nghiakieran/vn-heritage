import { useState } from 'react'

const Avatar = ({ 
  src, 
  name, 
  size = 'md', 
  className = '',
  fallbackClassName = ''
}) => {
  const [imgError, setImgError] = useState(false)

  // Lấy 2 chữ cái đầu của tên
  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  // Xử lý kích thước
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-9 w-9 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  }

  const sizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <div className="relative">
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={`rounded-full object-cover hover:opacity-80 transition-opacity ${sizeClass} ${className}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 hover:opacity-80 transition-opacity ${sizeClass} ${fallbackClassName}`}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}

export default Avatar 