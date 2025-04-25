import { cn } from '~/lib/utils'

/**
 * Component hiển thị tin nhắn hệ thống
 * @param {Object} props
 * @param {Object} props.message - Thông tin tin nhắn hệ thống
 */
const SystemMessage = ({ message }) => {
  return (
    <div className="flex justify-center mb-2">
      <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
        <p>{message.content}</p>
        <span className="text-xs opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

export default SystemMessage