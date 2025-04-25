import { cn } from '~/lib/utils'

export function TypingIndicator({ className, users, message }) {
  return (
    <div className={cn('flex justify-start mb-2 animate-fade-in', className)}>
      <div className='bg-muted p-3 rounded-lg shadow-sm'>
        {message ? (
          <span className='text-xs text-muted-foreground'>{message}</span>
        ) : (
          <div className='flex space-x-1'>
            <div className='typing-dot' style={{ animationDelay: '0ms' }}></div>
            <div className='typing-dot' style={{ animationDelay: '150ms' }}></div>
            <div className='typing-dot' style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}
