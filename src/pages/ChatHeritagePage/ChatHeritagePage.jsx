import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, Menu } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/slices/authSlice'
import { cn } from '~/lib/utils'
import { useIsMobile } from '~/hooks/useIsMobile'
import useSocket from '~/hooks/useSocket'
import { Button } from '~/components/common/ui/Button'
import { UserList } from './UserList'
import ChatMessage from './ChatMessage'
import { MessageInput } from './MessageInput'
import { TypingIndicator } from './TypingIndicator'
import SystemMessage from './SystemMessage'

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
  const { id } = useParams()
  const heritageId = id

  // State quản lý giao diện và dữ liệu chat
  const [activeChat, setActiveChat] = useState('community')
  const [directMessages, setDirectMessages] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

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
      message.isCurrentUser

    acc.push({ ...message, showAvatar })
    return acc
  }, [])

  console.log('Grouped messages:', groupedMessages)

  return (
    <div className="h-screen flex flex-col pt-navbar-mobile sm:pt-navbar">
      <div className="flex-1 flex overflow-hidden lcn-container-x">
        {/* Sidebar danh sách người dùng */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            sidebarOpen ? 'w-64 flex-shrink-0' : 'w-0',
            isMobile && sidebarOpen ? 'absolute z-20 h-full shadow-xl' : ''
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
          />
        </div>

        {/* Overlay trên mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Khu vực trò chuyện */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="border-b border-border bg-card p-4">
            <div className="flex items-center">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="mr-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              {sidebarOpen && isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-xl font-semibold">{getChatTitle()}</h1>
                <p className="text-sm text-muted-foreground">
                  {activeChat === 'community'
                    ? 'Cùng nhau thảo luận về các địa điểm di sản'
                    : 'Trò chuyện riêng tư'}
                </p>
              </div>
            </div>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && (
            <div className="p-4 bg-red-100 text-red-700 text-center">
              {error}
            </div>
          )}

          {/* Nội dung tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef} onScroll={handleScroll}>
            {activeChat === 'community' && isLoadingMessages && (
              <div className="text-center text-muted-foreground">Đang tải tin nhắn...</div>
            )}
            {activeChat === 'community' && !hasMoreMessages && messages.length > 0 && (
              <div className="text-center text-muted-foreground">Đã tải hết tin nhắn</div>
            )}
            {groupedMessages.map((msg) =>
              msg.isSystemMessage ? (
                <SystemMessage key={msg.id} message={msg} />
              ) : (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  showAvatar={msg.showAvatar}
                  isCurrentUser={msg.isCurrentUser}
                />
              )
            )}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Input soạn tin nhắn */}
          <div className="p-4">
            <MessageInput
              onSendMessage={handleSendMessage}
              onInputChange={handleInputChange}
              placeholder={`Gửi tin nhắn đến ${
                activeChat === 'community'
                  ? 'cộng đồng'
                  : MOCK_USERS.find((u) => u.id === activeChat)?.name
              }...`}
              disabled={!!error} // Vô hiệu hóa input nếu có lỗi
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeritagePage