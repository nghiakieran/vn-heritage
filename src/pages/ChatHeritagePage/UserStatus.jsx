import { User } from 'lucide-react'
import { cn } from '~/lib/utils'

export function UserStatus({ name, status, avatar, className, showStatus = true, size = 'md' }) {
  const DEFAULT_AVATAR = '/images/avatar-default.jpg'
  const avatarSizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
  }

  const statusSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-3.5 w-3.5',
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400',
  }

  return (
    <div className={cn('flex items-center justify-between w-full', className)}>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <div className={cn('rounded-full flex items-center justify-center bg-primary/20 text-white', avatarSizes[size])}>
            {avatar ? (
              <img
                src={avatar}
                loading='lazy'
                alt={name || 'User'}
                className='rounded-full object-cover w-full h-full'
                onError={(e) => {
                  if (e.target.src !== DEFAULT_AVATAR) {
                    e.target.src = DEFAULT_AVATAR
                  }
                }}
              />
            ) : (
              <User className={cn(size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6')} />
            )}
          </div>
          {showStatus && (
            <span
              className={cn(
                'absolute bottom-0 right-0 rounded-full border-2 border-sidebar',
                statusColors[status] || statusColors.offline,
                statusSizes[size],
                status === 'online' && 'animate-pulse-dot',
              )}
            />
          )}
        </div>
        <div className='overflow-hidden'>
          <span
            className={cn(
              size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg',
              'font-medium truncate block',
            )}
          >
            {name || 'Unknown'}
          </span>
          {showStatus && (
            <div className={cn('flex items-center', size === 'sm' ? 'text-xs' : 'text-sm', 'text-white/60')}>
              <span className='capitalize'>{status || 'offline'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}