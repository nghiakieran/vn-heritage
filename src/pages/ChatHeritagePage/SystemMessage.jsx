/**
 * Component hiển thị tin nhắn hệ thống
 * @param {Object} props
 * @param {Object} props.message - Thông tin tin nhắn hệ thống
 */
const SystemMessage = ({ message }) => {
  return (
    <div className='flex justify-center my-3 animate-fade-in'>
      <div className='bg-accent text-accent-foreground text-xs px-4 py-2 rounded-full shadow-sm'>
        <p>{message.content}</p>
      </div>
    </div>
  )
}

export default SystemMessage
