import { User } from 'lucide-react'
import { Avatar } from '~/components/common/ui/Avatar'

export function ChatMessage({ message, showAvatar = true }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  if (message.isCurrentUser) {
    return (
      <div className='flex justify-end mb-4 gap-2'>
        <div className='max-w-[80%]'>
          <div className='bg-primary text-primary-foreground p-3 rounded-lg'>
            <p className='whitespace-pre-wrap'>{message.content}</p>
          </div>
          <div className='text-xs mt-1 text-muted-foreground text-right'>
            {time}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className='flex mb-4 gap-2'>
      {showAvatar && (
        <Avatar className='h-8 w-8 mt-1 flex-shrink-0'>
          {message.sender.avatar ? (
            <img src={message.sender.avatar} alt={message.sender.name} />
          ) : (
            <User className='h-4 w-4' />
          )}
        </Avatar>
      )}
      <div className='max-w-[80%]'>
        {showAvatar && (
          <div className='text-sm font-medium mb-1'>{message.sender.name}</div>
        )}
        <div className='bg-muted p-3 rounded-lg'>
          <p className='whitespace-pre-wrap'>{message.content}</p>
        </div>
        <div className='text-xs mt-1 text-muted-foreground'>
          {time}
        </div>
      </div>
    </div>
  )
}
