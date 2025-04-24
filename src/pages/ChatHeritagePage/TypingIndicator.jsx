import { cn } from '~/lib/utils'

export function TypingIndicator({ className, users, message }) {
  return (
    <div className={cn('flex justify-start mb-4', className)}>
      <div className='bg-muted p-3 rounded-lg'>
        {message ? (
          <span className='text-sm text-muted-foreground'>{message}</span>
        ) : (
          <div className='flex space-x-1'>
            <div
              className='w-2 h-2 rounded-full bg-primary animate-bounce'
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className='w-2 h-2 rounded-full bg-primary animate-bounce'
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className='w-2 h-2 rounded-full bg-primary animate-bounce'
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        )}
      </div>
    </div>
  )
}
