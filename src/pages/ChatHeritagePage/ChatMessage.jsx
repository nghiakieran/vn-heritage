import { useState } from 'react'
import { CheckCheck } from 'lucide-react'
import { cn } from '~/lib/utils'

/**
 * Component hiển thị tin nhắn người dùng
 * @param {Object} props
 * @param {Object} props.message - Thông tin tin nhắn
 * @param {boolean} props.showAvatar - Có hiển thị avatar không
 * @param {boolean} props.showTimestamp - Có hiển thị thời gian không
 * @param {boolean} props.isCurrentUser - Là tin nhắn của người dùng hiện tại
 * @param {boolean} props.isLastInGroup - Là tin nhắn cuối cùng trong nhóm
 */
const ChatMessage = ({ message, showAvatar, showTimestamp, isCurrentUser, isLastInGroup }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Format thời gian tin nhắn
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return `${date.toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
  }

  // Luôn tính sẵn thời gian để giữ chiều cao ổn định
  const timeString = formatMessageTime(message.timestamp)

  return (
    <div
      className={cn(
        'flex mb-1 animate-fade-in',
        isCurrentUser ? 'justify-end' : 'justify-start',
        isLastInGroup && 'mb-3',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn('max-w-[75%] flex items-end gap-2', isCurrentUser ? 'flex-row-reverse' : 'flex-row')}>
        {/* Avatar */}
        {showAvatar && !isCurrentUser && (
          <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0'>
            {message.sender.name[0].toUpperCase()}
          </div>
        )}

        {/* Placeholder khi không hiển thị avatar để căn chỉnh */}
        {!showAvatar && !isCurrentUser && <div className='w-8 flex-shrink-0' />}

        {/* Nội dung tin nhắn */}
        <div className='flex flex-col'>
          {/* Tên người gửi (chỉ hiển thị khi là tin nhắn đầu tiên trong nhóm) */}
          {showAvatar && !isCurrentUser && (
            <span className='text-xs text-muted-foreground ml-1 mb-1'>{message.sender.name}</span>
          )}

          <div
            className={cn(
              'message-bubble group relative',
              isCurrentUser ? 'message-bubble-user' : 'message-bubble-other',
            )}
          >
            <p className='whitespace-pre-wrap'>{message.content}</p>

            {/* Trạng thái đã đọc và thời gian (luôn hiển thị nhưng chỉ hiện thời gian khi hover) */}
            {isCurrentUser && isLastInGroup && (
              <div className='flex justify-end items-center mt-1 text-xs h-4'>
                {' '}
                {/* Chiều cao cố định */}
                <span
                  className={cn(
                    'mr-1 text-primary-foreground/70 transition-opacity duration-200',
                    isHovered ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  {timeString}
                </span>
                <CheckCheck className='h-3 w-3 text-primary-foreground/70' />
              </div>
            )}
          </div>

          {/* Hiển thị thời gian */}
          {showTimestamp && !isCurrentUser && (
            <span className='text-xs text-muted-foreground ml-1 mt-1'>{timeString}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
