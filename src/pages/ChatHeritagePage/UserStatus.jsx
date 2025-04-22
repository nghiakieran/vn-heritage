import { User } from 'lucide-react'

import { Avatar } from '~/components/common/ui/Avatar'
import { cn } from '~/lib/utils'


export function UserStatus({ 
  name, 
  status, 
  avatar, 
  className,
  showStatus = true,
  size = 'md' 
}) {
  const avatarSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  }

  const statusSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5'
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-500'
  }

  return (
    <div className={cn('flex items-center', className)}>
      <div className='relative'>
        <Avatar className={cn(avatarSizes[size])}>
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <User className={cn(size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5')} />
          )}
        </Avatar>
        {showStatus && (
          <span 
            className={cn(
              'absolute bottom-0 right-0 rounded-full border border-background',
              statusColors[status],
              statusSizes[size]
            )}
          />
        )}
      </div>
      <div className='ml-2'>
        <span className={cn(
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base',
          'font-medium'
        )}>{name}</span>
        {showStatus && (
          <div className={cn(
            'flex items-center',
            size === 'sm' ? 'text-[10px]' : 'text-xs',
            'text-muted-foreground'
          )}>
            <span className={cn(
              'mr-1 rounded-full',
              statusColors[status],
              size === 'sm' ? 'h-1 w-1' : 'h-1.5 w-1.5'
            )}></span>
            <span className='capitalize'>{status}</span>
          </div>
        )}
      </div>
    </div>
  )
}
