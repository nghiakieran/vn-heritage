import { Users2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Button } from '~/components/common/ui/Button'
import { UserStatus } from './UserStatus'
import { cn } from '~/lib/utils'

export function UserList({ 
  users, 
  activeUserId, 
  onSelectUser, 
  onSelectCommunity, 
  isCommunityActive,
  onlineUsers = [] 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Cập nhật trạng thái online cho người dùng dựa trên socket
  const enhancedUsers = useMemo(() => {
    return users.map(user => {
      // Kiểm tra xem người dùng có online trong phòng chat không
      const isOnlineInRoom = onlineUsers.some(onlineUser => onlineUser.id === user.id);
      
      // Nếu người dùng có trong danh sách online từ socket, luôn đánh dấu là online
      return isOnlineInRoom 
        ? { ...user, status: 'online' } 
        : user;
    });
  }, [users, onlineUsers]);
  
  const filteredUsers = useMemo(() => {
    return enhancedUsers.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [enhancedUsers, searchQuery]);

  // Đếm số người dùng online trong phòng community
  const onlineCount = onlineUsers.length;

  return (
    <div className='h-full flex flex-col bg-sidebar border-r border-border'>
      <div className='p-4 border-b border-border'>
        <h2 className='font-semibold text-lg mb-2'>Heritage Hub Chat</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Tìm kiếm người dùng...'
            className='w-full bg-sidebar-accent rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className='flex-1 overflow-y-auto'>
        <div className='p-3'>
          <Button
            variant='ghost' 
            className={cn(
              'w-full justify-start mb-1 font-medium', 
              isCommunityActive ? 'bg-sidebar-accent' : ''
            )}
            onClick={onSelectCommunity}
          >
            <Users2 className='h-5 w-5 mr-2' />
            <div className='flex-1 flex justify-between items-center'>
              <span>Community Chat</span>
              {onlineCount > 0 && (
                <span className='text-xs font-normal text-muted-foreground'>
                  {onlineCount} online
                </span>
              )}
            </div>
          </Button>
          
          <div className='mt-4'>
            <div className='px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase'>
              Direct Messages
            </div>
            
            <div className='space-y-1'>
              {filteredUsers.map(user => (
                <Button 
                  key={user.id}
                  variant='ghost' 
                  className={cn(
                    'w-full justify-start p-2 h-auto', 
                    activeUserId === user.id ? 'bg-sidebar-accent' : ''
                  )}
                  onClick={() => onSelectUser(user.id)}
                >
                  <UserStatus
                    name={user.name} 
                    status={user.status}
                    avatar={user.avatar}
                    size='sm'
                  />
                  {!!user.unreadCount && <span className='ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-1'>{user.unreadCount}</span>}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className='p-4 border-t border-border'>
        <UserStatus 
          name='Your Name' 
          status='online' 
          size='md'
        />
      </div>
    </div>
  )
}
