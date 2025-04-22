import { cn } from '~/lib/utils'

// Avatar
function Avatar({ className, ...props }) {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    />
  )
}
Avatar.displayName = 'Avatar'

// Avatar Image
function AvatarImage({ className, src, alt = '', ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
}
AvatarImage.displayName = 'AvatarImage'

// Avatar Fallback
function AvatarFallback({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted text-white',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }
