import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { cn } from '~/lib/utils'
import Sidebar from '~/components/admin/Sidebar'
import Header from '~/components/admin/Header'

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          mobileSidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
