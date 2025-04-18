import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '~/lib/utils'


const Dialog = ({ open, onClose, children }) => {
 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!open) return null

  const handleContentClick = (e) => e.stopPropagation()
  return (
    <div className='fixed inset-0 z-50'>
      <div className='fixed inset-0 bg-black/80 animate-fade-in' onClick={onClose} />
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='dialog-title'
        aria-describedby='dialog-description'
        className='fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border bg-background p-6 shadow-lg sm:rounded-lg'
        onClick={handleContentClick}
      >
        <button onClick={onClose} className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100'>
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

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
  <h2 id='dialog-title' className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
    {children}
  </h2>
)

const DialogDescription = ({ className, children, ...props }) => (
  <p id='dialog-description' className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
)

export {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
