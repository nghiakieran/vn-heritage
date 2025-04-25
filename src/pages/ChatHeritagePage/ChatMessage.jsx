import { cn } from '~/lib/utils'

/**
 * Component hiển thị tin nhắn người dùng
 * @param {Object} props
 * @param {Object} props.message - Thông tin tin nhắn
 * @param {boolean} props.showAvatar - Có hiển thị avatar không
 * @param {boolean} props.isCurrentUser - Là tin nhắn của người dùng hiện tại
 */
const ChatMessage = ({ message, showAvatar, isCurrentUser }) => {
  return (
    <div
      className={cn(
        'flex mb-2',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[70%] flex items-end gap-2',
          isCurrentUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        {/* Avatar */}
        {showAvatar && !isCurrentUser && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
            {message.sender.name[0].toUpperCase()}
          </div>
        )}

        {/* Nội dung tin nhắn */}
        <div
          className={cn(
            'p-3 rounded-lg',
            isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          )}
        >
          <p>{message.content}</p>
          <span className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage