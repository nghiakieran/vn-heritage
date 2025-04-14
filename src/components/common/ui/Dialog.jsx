import { X } from 'lucide-react'
import { cn } from '~/lib/utils'


const Dialog = ({ open, onClose, children }) => {
  if (!open) return null
  const handleContentClick = (e) => e.stopPropagation()
  return (
    <div className='fixed inset-0 z-50'>
      <div className='fixed inset-0 bg-black/80 animate-fade-in' onClick={onClose} />
      <div
        className='fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border bg-background p-6 shadow-lg sm:rounded-lg animate-zoom-in'
        onClick={handleContentClick}
      >
        <button
          onClick={onClose}
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

const DialogTrigger = ({ children, onClick }) => (
  <button onClick={onClick} className='inline-block'>
    {children}
  </button>
)

const DialogHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props}>
    {children}
  </div>
)

const DialogFooter = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ className, children, ...props }) => (
  <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
)

export {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
