import { Link, useLocation } from 'react-router-dom'
import { cn } from '~/lib/utils'

const NavLinks = ({ navLinks }) => {
  const location = useLocation()
  return (
    <nav className='hidden sm:flex justify-between space-x-8'>
      {
        navLinks.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-1.5 text-sm hover:text-heritage transition-colors',
              location.pathname === item.to ? 'text-heritage font-medium' : 'text-muted-foreground')}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))
      }
    </nav>
  )
}

export default NavLinks
