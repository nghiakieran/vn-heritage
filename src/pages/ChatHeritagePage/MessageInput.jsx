import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, ImageIcon, Mic } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/common/ui/Button'
import { useIsMobile } from '~/hooks/useIsMobile'

export function MessageInput({ onSendMessage, onInputChange, placeholder = 'Nhập tin nhắn...', disabled = false }) {
  const [message, setMessage] = useState('')
  const [showTools, setShowTools] = useState(false)
  const textareaRef = useRef(null)
  const isMobile = useIsMobile()

   // Thiết lập chiều cao ban đầu khi component mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px' // Chiều cao mặc định
    }
  }, [])

  // Tự động điều chỉnh chiều cao của textarea khi nhập
  useEffect(() => {
     if (textareaRef.current) {

      // Reset về chiều cao tối thiểu trước khi tính toán lại
      textareaRef.current.style.height = '40px'

      // Nếu có nội dung, mở rộng theo nội dung, nếu không thì giữ ở 40px
      if (message.trim()) {
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
      }
    }
  }, [message, isMobile])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
      // Reset chiều cao của textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    // Gọi callback khi người dùng đang nhập
    if (onInputChange) {
      onInputChange()
    }
  }

  return (
    <div className='flex flex-col gap-2 animate-fade-in'>
      {/* Thanh công cụ mở rộng */}
      {showTools && (
        <div className='flex items-center gap-2 px-2 py-1 bg-accent rounded-lg animate-fade-in'>
          <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full text-primary'>
            <ImageIcon className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full text-primary'>
            <Mic className='h-4 w-4' />
          </Button>
          <Button variant='ghost' size='icon' className='h-8 w-8 rounded-full text-primary'>
            <Smile className='h-4 w-4' />
          </Button>
        </div>
      )}

      {/* Input chính */}
      <div className='flex  gap-2 bg-card rounded-lg border border-border p-2 items-center'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='h-8 w-8 rounded-full text-muted-foreground hover:text-primary flex-shrink-0'
          onClick={() => setShowTools(!showTools)}
        >
          <Paperclip className='h-4 w-4' />
        </Button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className='chat-input min-h-[40px] max-h-[120px] flex-1'
          rows={1}
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
    </div>
  )
}
