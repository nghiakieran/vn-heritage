import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'

import { UserList } from './UserList'
import { ChatMessage } from './ChatMessage'
import { MessageInput } from './MessageInput'
import { TypingIndicator } from './TypingIndicator'

import { cn } from '~/lib/utils'
import { useIsMobile } from '~/hooks/useIsMobile'
import { Button } from '~/components/common/ui/Button'

// Dữ liệu giả người dùng
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

// Dữ liệu giả trò chuyện cộng đồng
const MOCK_COMMUNITY_MESSAGES = [
  {
    id: 'c1',
    content: 'Chào mừng đến với phòng trò chuyện cộng đồng Di sản! Hãy cùng chia sẻ và thảo luận về các địa điểm văn hóa nhé.',
    sender: { id: 'admin', name: 'Quản trị viên' },
    timestamp: '2023-04-20T09:00:00.000Z',
    isCurrentUser: false,
  },
  {
    id: 'c2',
    content: 'Có ai ghé thăm Kinh thành Huế gần đây chưa? Trông tuyệt vời sau khi trùng tu!',
    sender: { id: '1', name: 'John Doe' },
    timestamp: '2023-04-20T09:05:00.000Z',
    isCurrentUser: false,
  },
  {
    id: 'c3',
    content: 'Tôi mới đến tháng trước! Tử Cấm Thành nhìn rất tuyệt.',
    sender: { id: '2', name: 'Jane Smith' },
    timestamp: '2023-04-20T09:07:00.000Z',
    isCurrentUser: false,
  },
  {
    id: 'c4',
    content: 'Tôi sắp đi Hạ Long vào tháng tới. Có đề xuất nào cho du thuyền tốt không?',
    sender: { id: '5', name: 'Michael Brown' },
    timestamp: '2023-04-20T09:15:00.000Z',
    isCurrentUser: false,
  },
  {
    id: 'c5',
    content: 'Paradise Cruises hoặc Bhaya Cruises đều rất tốt. Nên ở ít nhất 3 ngày để trải nghiệm trọn vẹn nhé!',
    sender: { id: '3', name: 'Robert Johnson' },
    timestamp: '2023-04-20T09:20:00.000Z',
    isCurrentUser: false,
  },
  {
    id: 'c6',
    content: 'Mình sẽ đến Hội An dịp lễ hội đèn lồng! Hào hứng quá!',
    sender: { id: 'currentUser', name: 'Bạn' },
    timestamp: '2023-04-20T09:30:00.000Z',
    isCurrentUser: true,
  },
]

// Tạo tin nhắn giả cho trò chuyện riêng
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

const ChatHeritagePage = () => {
  const [activeChat, setActiveChat] = useState('community')
  const [messages, setMessages] = useState(MOCK_COMMUNITY_MESSAGES)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const chatContainerRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    if (activeChat === 'community') {
      setMessages(MOCK_COMMUNITY_MESSAGES)
    } else {
      setMessages(generateMockMessages(activeChat))
    }
  }, [activeChat])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (content) => {
    const newMessage = {
      id: `new-${Date.now()}`,
      content,
      sender: {
        id: 'currentUser',
        name: 'Bạn',
      },
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
    }

    setMessages(prev => [...prev, newMessage])

    if (activeChat !== 'community') {
      const user = MOCK_USERS.find(u => u.id === activeChat)
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
          setMessages(prev => [...prev, responseMessage])
        }, 1500 + Math.random() * 2000)
      }
    }
  }

  const getChatTitle = () => {
    if (activeChat === 'community') return 'Phòng Trò Chuyện Cộng Đồng'
    const user = MOCK_USERS.find(u => u.id === activeChat)
    return user ? user.name : 'Trò chuyện'
  }

  const groupedMessages = messages.reduce((acc, message, index) => {
    const prev = messages[index - 1]
    const showAvatar = !prev || prev.sender.id !== message.sender.id || message.isCurrentUser
    acc.push({ ...message, showAvatar })
    return acc
  }, [])

  return (
    <div className='h-screen flex flex-col pt-navbar-mobile sm:pt-navbar'>
      <div className='flex-1 flex overflow-hidden lcn-container-x'>
        {/* Sidebar danh sách người dùng */}
        <div className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64 flex-shrink-0' : 'w-0',
          isMobile && sidebarOpen ? 'absolute z-20 h-full shadow-xl' : ''
        )}>
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
          />
        </div>

        {/* Overlay trên mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className='fixed inset-0 bg-black/20 z-10'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Khu vực trò chuyện */}
        <div className='flex-1 flex flex-col h-full overflow-hidden'>
          {/* Header */}
          <div className='border-b border-border bg-card p-4'>
            <div className='flex items-center'>
              {(!sidebarOpen) && (
                <Button variant='ghost' size='icon' onClick={() => setSidebarOpen(true)} className='mr-2'>
                  <Menu className='h-5 w-5' />
                </Button>
              )}
              {sidebarOpen && isMobile && (
                <Button variant='ghost' size='icon' onClick={() => setSidebarOpen(false)} className='mr-2'>
                  <ArrowLeft className='h-5 w-5' />
                </Button>
              )}
              <div>
                <h1 className='text-xl font-semibold'>{getChatTitle()}</h1>
                <p className='text-sm text-muted-foreground'>
                  {activeChat === 'community'
                    ? 'Cùng nhau thảo luận về các địa điểm di sản'
                    : 'Trò chuyện riêng tư'}
                </p>
              </div>
            </div>
          </div>

          {/* Nội dung tin nhắn */}
          <div className='flex-1 overflow-y-auto p-4' ref={chatContainerRef}>
            {groupedMessages.map(msg => (
              <ChatMessage key={msg.id} message={msg} showAvatar={msg.showAvatar} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Input soạn tin nhắn */}
          <div className='p-4'>
            <MessageInput
              onSendMessage={handleSendMessage}
              placeholder={`Gửi tin nhắn đến ${
                activeChat === 'community' ? 'cộng đồng' : MOCK_USERS.find(u => u.id === activeChat)?.name
              }...`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatHeritagePage
