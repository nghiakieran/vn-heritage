import { Link, useLocation } from 'react-router-dom'
import { cn } from '~/lib/utils'

const NavLinks = ({ navLinks }) => {
  const location = useLocation()

  return (
    <nav className='hidden sm:flex items-center gap-6'>
      {navLinks.map((link) => {
        const isActive = location.pathname === link.to
        return (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors hover:text-heritage',
              {
                'text-heritage': isActive,
                'text-muted-foreground': !isActive
              }
            )}
          >
            {link.icon()}
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}

export default NavLinks
