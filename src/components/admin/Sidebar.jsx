import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '~/lib/utils'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '~/components/common/ui/button'

const navItems = [
  // {
  //   title: 'Dashboard',
  //   href: '/dashboard',
  //   icon: LayoutDashboard
  // },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div
      className={cn(
        'h-screen flex flex-col border-r border-sidebar-border bg-sidebar',
        // Thêm transition cho width và thay đổi giá trị width cụ thể
        'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[103px]' : 'w-[240px]'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-heritage flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">Admin</span>
          </Link>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-full bg-heritage flex items-center justify-center text-white font-bold">
            A
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
                  collapsed ? 'justify-center' : 'justify-start'
                )}
              >
                <Icon size={20} className={cn(collapsed ? 'mx-0' : 'mr-3')} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          className="w-full text-sidebar-foreground hover:bg-sidebar-accent flex items-center justify-center"
        >
          <LogOut size={20} className={cn(collapsed ? 'mx-0' : 'mr-2')} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
