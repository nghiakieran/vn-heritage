import { useState } from 'react'
import { Send } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/common/ui/Button'


export function MessageInput({ onSendMessage, placeholder = 'Type a message...' }) {
  const [message, setMessage] = useState('')
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  
  return (
    <div className='flex items-center gap-2 p-4 bg-card rounded-lg border border-border animate-fade-in'>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className='flex-1 bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all'
        rows={2}
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim()}
        className={cn(
          'bg-primary hover:bg-primary/90 text-primary-foreground transition-all', 
          message.trim() ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
        )}
      >
        <Send className='h-5 w-5' />
      </Button>
    </div>
  )
}
