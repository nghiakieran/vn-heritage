import { Users2, Search, X, Smile } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { Button } from '~/components/common/ui/Button'
import { UserStatus } from './UserStatus'
import { cn } from '~/lib/utils'

export function UserList({
  users,
  activeUserId,
  onSelectUser,
  onSelectCommunity,
  isCommunityActive,
  onlineUsers = [],
  isOpen = true,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  // Cập nhật trạng thái online cho người dùng dựa trên socket
  const enhancedUsers = useMemo(() => {
    return users.map((user) => {
      // Kiểm tra xem người dùng có online trong phòng chat không
      const isOnlineInRoom = onlineUsers.some((onlineUser) => onlineUser.id === user.id)

      // Nếu người dùng có trong danh sách online từ socket, luôn đánh dấu là online
      return isOnlineInRoom ? { ...user, status: 'online' } : user
    })
  }, [users, onlineUsers])

  const filteredUsers = useMemo(() => {
    return enhancedUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [enhancedUsers, searchQuery])

  // Đếm số người dùng online trong phòng community
  const onlineCount = onlineUsers.length

  // Sắp xếp người dùng: online trước, sau đó là away, cuối cùng là offline
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const statusOrder = { online: 0, away: 1, offline: 2 }
      return statusOrder[a.status] - statusOrder[b.status] || (b.unreadCount || 0) - (a.unreadCount || 0)
    })
  }, [filteredUsers])
  
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    // Clean up when component unmount
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  // Only render when sidebar is open and onSelectUser is provided
  if (!isOpen || !onSelectUser) return null
  
  return (
    <div className='h-screen flex flex-col bg-sidebar text-white'>
      <div className='p-4 border-b border-white/10'>
        <h2 className='font-semibold text-lg mb-3'>Heritage Hub Chat</h2>
        <div className={cn(
          'flex items-center transition-all duration-200 bg-sidebar-accent rounded-lg px-4 py-2',
          searchFocused ? 'ring-2 ring-primary/50' : ''
        )}>
          <Search className='h-4 w-4 text-white/50' />
          <input
            type='text'
            placeholder='Tìm kiếm người dùng...'
            className='flex-1 pl-4 pr-2 bg-transparent text-sm focus:outline-none placeholder:text-white/50'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          /> 
          {searchQuery && (
            <button
              className='text-white/70 hover:text-white'
              onClick={() => setSearchQuery('')}
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto scrollbar-custom min-h-0'>
        <div className='p-3'>
          <Button
            variant='ghost'
            className={cn(
              'w-full justify-start mb-2 font-medium text-white hover:bg-sidebar-accent transition-all',
              isCommunityActive ? 'bg-sidebar-accent' : '',
            )}
            onClick={onSelectCommunity}
          >
            <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2'>
              <Users2 className='h-4 w-4' />
            </div>
            <div className='flex-1 flex justify-between items-center'>
              <span>Phòng Cộng Đồng</span>
              {onlineCount > 0 && (
                <span className='text-xs font-normal bg-primary/20 px-2 py-0.5 rounded-full'>{onlineCount} online</span>
              )}
            </div>
          </Button>

          <div className='mt-4'>
            <div className='px-3 mb-2 text-xs font-semibold text-white/50 uppercase tracking-wider'>
              Tin nhắn riêng tư
            </div>

            <div className='space-y-1'>
              {sortedUsers.map((user) => (
                <Button
                  key={user.id}
                  variant='ghost'
                  className={cn(
                    'w-full justify-start p-2 h-auto text-white hover:bg-sidebar-accent transition-all',
                    activeUserId === user.id ? 'bg-sidebar-accent' : '',
                  )}
                  onClick={() => onSelectUser(user.id)}
                >
                  <UserStatus name={user.name} status={user.status} avatar={user.avatar} size='sm' />
                  {!!user.unreadCount && (
                    <span className='ml-auto bg-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center'>
                      {user.unreadCount}
                    </span>
                  )}
                </Button>
              ))}

              {filteredUsers.length === 0 && (
                <div className='text-center py-4 text-white/50 text-sm'>Không tìm thấy người dùng</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='p-4 border-t border-white/10 flex items-center justify-between sticky bottom-0 z-10 bg-sidebar'>
        <UserStatus name='Tài khoản của bạn' status='online' size='md' />
        <Button variant='ghost' size='icon' className='h-8 w-8 text-white/70'>
          <Smile className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
