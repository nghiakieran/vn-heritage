import { ArrowLeft, Menu, ChevronDown, Users } from 'lucide-react'
import { useEffect, useRef, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '~/store/slices/authSlice'
import { Button } from '~/components/common/ui/Button'
import { useIsMobile } from '~/hooks/useIsMobile'
import { TypingIndicator } from './TypingIndicator'
import { MessageInput } from './MessageInput'
import useSocket from '~/hooks/useSocket'
import SystemMessage from './SystemMessage'
import ChatMessage from './ChatMessage'
import { UserList } from './UserList'
import { cn } from '~/lib/utils'

// Dữ liệu giả cho danh sách người dùng
const MOCK_USERS = [
  { id: '1', name: 'John Doe', status: 'online', unreadCount: 3 },
  { id: '2', name: 'Jane Smith', status: 'online', unreadCount: 0 },
  { id: '3', name: 'Robert Johnson', status: 'away', unreadCount: 0 },
  { id: '4', name: 'Emily Wilson', status: 'offline', lastSeen: '3h trước', unreadCount: 0 },
  { id: '5', name: 'Michael Brown', status: 'online', unreadCount: 1 },
  { id: '6', name: 'Sarah Lee', status: 'online', unreadCount: 0 },
  { id: '7', name: 'David Kim', status: 'away', unreadCount: 2 },
  { id: '8', name: 'Amanda Chen', status: 'offline', lastSeen: '1 ngày trước', unreadCount: 0 },
]

// Dữ liệu giả cho tin nhắn cộng đồng
const MOCK_COMMUNITY_MESSAGES = []

/**
 * Tạo tin nhắn giả cho trò chuyện riêng
 * @param {string} userId - ID của người dùng
 * @returns {Array} - Danh sách tin nhắn giả
 */
const generateMockMessages = (userId) => {
  const user = MOCK_USERS.find(u => u.id === userId)
  if (!user) return []

  return [
    {
      id: `${userId}-1`,
      content: 'Chào bạn! Gần đây bạn đã khám phá di sản nào chưa?',
      sender: { id: userId, name: user.name },
      timestamp: new Date(Date.now() - 100000000).toISOString(),
      isCurrentUser: false,
    },
  ]
}

/**
 * Component chính cho trang chat cộng đồng và riêng tư
 */
const ChatHeritagePage = () => {
  const userInfo = useSelector(selectCurrentUser)
  const isMobile = useIsMobile()
  const chatContainerRef = useRef(null)
  const location = useLocation()

  const { heritageId: id, heritageName } = location.state || {}
  const heritageId = id

  // State quản lý giao diện và dữ liệu chat
  const [activeChat, setActiveChat] = useState('community')
  const [directMessages, setDirectMessages] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  // Thông tin người dùng hiện tại
  const currentUser = useMemo(
    () => ({
      userId: userInfo?._id,
      username: userInfo?.displayname,
    }),
    [userInfo?._id, userInfo?.displayname]
  )

  // Hook socket cho phòng chat (chỉ dùng khi activeChat là 'community')
  const socketData = useSocket(currentUser, heritageId)

  const {
    isConnected,
    messages: communityMessages,
    typingUsers,
    usersInRoom,
    sendMessage: sendCommunityMessage,
    handleTyping: handleCommunityTyping,
    roomId,
    socketError: error,
    isLoadingMessages,
    hasMoreMessages,
    loadMoreMessages,
  } = activeChat === 'community' ? socketData : {
    isConnected: false,
    messages: [],
    typingUsers: [],
    usersInRoom: [],
    sendMessage: () => {},
    handleTyping: () => {},
    roomId: null,
    socketError: null,
    isLoadingMessages: false,
    hasMoreMessages: false,
    loadMoreMessages: () => {},
  }

  // Lấy tin nhắn cho cuộc trò chuyện hiện tại
  const messages = useMemo(() => {
    if (activeChat === 'community') {
      console.log('Community messages:', communityMessages)
      return communityMessages.length > 0 ? communityMessages : MOCK_COMMUNITY_MESSAGES
    }
    return directMessages[activeChat] || generateMockMessages(activeChat)
  }, [activeChat, communityMessages, directMessages])

  // Điều chỉnh sidebar dựa trên thiết bị
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Xử lý kéo lên để tải thêm tin nhắn (chỉ cho community chat)
  const handleScroll = () => {
    if (activeChat !== 'community' || !chatContainerRef.current) return
    const { scrollTop } = chatContainerRef.current
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
      loadMoreMessages()
    }
  }

  // Xử lý gửi tin nhắn
  const handleSendMessage = (content) => {
    if (activeChat === 'community') {
      sendCommunityMessage(content)
    } else {
      const newMessage = {
        id: `new-${Date.now()}`,
        content,
        sender: currentUser,
        timestamp: new Date().toISOString(),
        isCurrentUser: true,
      }

      setDirectMessages((prev) => ({
        ...prev,
        [activeChat]: [...(prev[activeChat] || generateMockMessages(activeChat)), newMessage],
      }))

      const user = MOCK_USERS.find((u) => u.id === activeChat)
      if (user) {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const responseMessage = {
            id: `response-${Date.now()}`,
            content: 'Cảm ơn bạn đã chia sẻ! Mình sẽ phản hồi sớm nhé.',
            sender: { id: user.id, name: user.name },
            timestamp: new Date().toISOString(),
            isCurrentUser: false,
          }
          setDirectMessages((prev) => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), responseMessage],
          }))
        }, 1500 + Math.random() * 2000)
      }
    }
  }

  // Xử lý sự kiện nhập tin nhắn
  const handleInputChange = () => {
    // Bỏ gọi handleCommunityTyping vì không cần emit typing nữa
    if (activeChat === 'community') {
      handleCommunityTyping(true)
      // Thêm debounce để giảm số lượng sự kiện gửi đi
      clearTimeout(window.typingTimeout)
      window.typingTimeout = setTimeout(() => {
        handleCommunityTyping(false)
      }, 2000)
    }
  }

  // Lấy tiêu đề cuộc trò chuyện
  const getChatTitle = () => {
    if (activeChat === 'community') return 'Phòng Trò Chuyện Cộng Đồng'
    const user = MOCK_USERS.find((u) => u.id === activeChat)
    return user ? user.name : 'Trò chuyện'
  }

  // Nhóm tin nhắn để hiển thị avatar và định dạng
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prev = messages[index - 1]
    if (message.isSystemMessage) {
      acc.push(message)
      return acc
    }

    const showAvatar =
      !prev ||
      prev.isSystemMessage ||
      prev.sender.id !== message.sender.id ||
      message.isCurrentUser !== prev.isCurrentUser

    // Thêm thông tin về thời gian hiển thị
    const showTimestamp =
      !messages[index + 1] ||
      messages[index + 1].isSystemMessage ||
      messages[index + 1].sender.id !== message.sender.id ||
      new Date(messages[index + 1].timestamp).getTime() - new Date(message.timestamp).getTime() > 5 * 60 * 1000

      acc.push({ ...message, showAvatar, showTimestamp })
      return acc
    }, [])

  console.log('Grouped messages:', groupedMessages)

  return (
    <div className='h-screen flex flex-col pt-navbar-mobile sm:pt-navbar bg-background'>
      <div className='flex-1 flex overflow-hidden lcn-container-x'>
        {/* Sidebar danh sách người dùng */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out bg-sidebar text-white',
            sidebarOpen ? 'w-72 flex-shrink-0' : 'w-0',
            isMobile && sidebarOpen ? 'absolute z-20 h-full shadow-sidebar' : '',
          )}
        >
          <UserList
            users={MOCK_USERS}
            activeUserId={activeChat !== 'community' ? activeChat : null}
            onSelectUser={(userId) => {
              setActiveChat(userId)
              if (isMobile) setSidebarOpen(false)
            }}
            onSelectCommunity={() => {
              setActiveChat('community')
              if (isMobile) setSidebarOpen(false)
            }}
            isCommunityActive={activeChat === 'community'}
            onlineUsers={usersInRoom}
            isOpen={sidebarOpen}
          />
        </div>

        {/* Overlay trên mobile */}
        {isMobile && sidebarOpen && (
          <div className='fixed inset-0 bg-black/20 z-10 backdrop-blur-sm' onClick={() => setSidebarOpen(false)} />
        )}

        {/* Khu vực trò chuyện */}
        <div className='flex-1 flex flex-col h-full overflow-hidden bg-background'>
          {/* Header */}
          <div className='border-b border-border bg-card p-3 shadow-sm'>
            <div className='flex items-center sm:justify-between'>
              {!sidebarOpen && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setSidebarOpen(true)}
                  className='mr-2 text-primary'
                >
                  <Menu className='h-5 w-5' />
                </Button>
              )}
              {sidebarOpen && isMobile && (
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setSidebarOpen(false)}
                  className='mr-2'
                >
                  <ArrowLeft className='h-5 w-5' />
                </Button>
              )}
              <div className='max-w-none'>
                {' '}
                {/* Giới hạn chiều rộng trên mobile */}
                <h1 className='text-lg sm:text-xl font-semibold'>{getChatTitle()}</h1>
                <p className='text-xs sm:text-sm text-muted-foreground truncate'>
                {activeChat === 'community'
                    ? `${usersInRoom.length} người đang tham gia thảo luận`
                    : 'Trò chuyện riêng tư'}
                </p>
              </div>
            </div>
            { (
              <div className='flex items-center gap-1'>
                {activeChat === 'community' && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='flex items-center gap-1 text-primary h-8 px-2'
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <Users className='h-4 w-4' />
                    <span className='hidden sm:inline'>{usersInRoom.length}</span>
                    <ChevronDown className={cn('h-4 w-4 transition-transform', showInfo && 'rotate-180')} />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Danh sách người dùng trong phòng (hiển thị khi nhấn vào nút Users) */}
          {showInfo && activeChat === 'community' && (
            <div className='mt-2 p-2 bg-accent rounded-lg animate-fade-in'>
              <div className='flex items-center justify-between mb-1'>
                <h3 className='font-medium text-sm'>Người dùng trong phòng</h3>
              </div>
              <div className='flex flex-wrap gap-1'>
                {usersInRoom.map((user) => (
                  <div
                    key={user.id}
                    className='px-2 py-0.5 bg-background rounded-full text-xs flex items-center gap-1'
                  >
                    <span className='w-1.5 h-1.5 rounded-full bg-green-500'></span>
                    {user.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className='p-4 bg-destructive/10 text-destructive text-center animate-fade-in'>
              <p className='font-medium'>{error}</p>
              <p className='text-sm'>Đang thử kết nối lại...</p>
            </div>
          )}

          {/* Nội dung tin nhắn */}
          <div
            className='flex-1 overflow-y-auto p-4 space-y-3 bg-background/50'
            ref={chatContainerRef}
            onScroll={handleScroll}
          >
            {activeChat === 'community' && isLoadingMessages && (
              <div className='text-center text-muted-foreground py-2 animate-pulse'>
                <div className='inline-block px-4 py-2 bg-muted rounded-lg'>Đang tải tin nhắn...</div>
              </div>
            )}
            {activeChat === 'community' && !hasMoreMessages && messages.length > 0 && (
              <div className='text-center text-muted-foreground py-2'>
                <div className='inline-block px-4 py-2 bg-muted rounded-lg text-sm'>Bạn đã xem hết tin nhắn</div>
              </div>
            )}
            {messages.length === 0 && !isLoadingMessages && (
              <div className='h-full flex flex-col items-center justify-center text-center text-muted-foreground py-10 animate-fade-in'>
                <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
                  <Users className='h-8 w-8 text-primary/50' />
                </div>
                <h3 className='text-lg font-medium text-foreground'>Chưa có tin nhắn nào</h3>
                <p className='max-w-xs text-sm mt-1'>
                  {activeChat === 'community'
                    ? 'Hãy bắt đầu cuộc trò chuyện với cộng đồng!'
                    : 'Hãy bắt đầu cuộc trò chuyện riêng tư!'}
                </p>
              </div>
            )}
            {groupedMessages.map((msg, index) =>
              msg.isSystemMessage ? (
                <SystemMessage key={msg.id} message={msg} />
              ) : (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  showAvatar={msg.showAvatar}
                  showTimestamp={msg.showTimestamp}
                  isCurrentUser={msg.isCurrentUser}
                  isLastInGroup={
                    index === groupedMessages.length - 1 ||
                    groupedMessages[index + 1].sender?.id !== msg.sender?.id ||
                    groupedMessages[index + 1].isSystemMessage
                  }
                />
              )
            )}
            {isTyping && <TypingIndicator />}
            {typingUsers && typingUsers.length > 0 && (
              <TypingIndicator message={`${typingUsers.map((u) => u.username).join(', ')} đang nhập...`} />
            )}
          </div>

          {/* Input soạn tin nhắn */}
          <div className='p-3 bg-card border-t border-border'>
            <MessageInput
              onSendMessage={handleSendMessage}
              onInputChange={handleInputChange}
              // placeholder={`Gửi tin nhắn đến ${
              //   activeChat === 'community'
              //     ? 'cộng đồng'
              //     : MOCK_USERS.find((u) => u.id === activeChat)?.name
              // }...`}
              placeholder='Gửi tin nhắn...'
              disabled={!!error} // Vô hiệu hóa input nếu có lỗi
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeritagePage