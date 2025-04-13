import { useState, createContext, useContext } from 'react'
import { cn } from '~/lib/utils'

const TabsContext = createContext()

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        'h-10 w-full grid grid-cols-4 mb-8 items-center justify-center rounded-md bg-muted text-muted-foreground p-1',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50',
        isActive && 'bg-heritage-light text-heritage-dark shadow-sm',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children }) {
  const { activeTab } = useContext(TabsContext)
  if (activeTab !== value) return null

  return (
    <div className={cn('animate-fade-in', className)}>
      {children}
    </div>
  )
}
