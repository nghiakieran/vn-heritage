import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '~/lib/utils'
import { Button } from '~/components/common/ui/button'

const HeritageCard = ({ item }) => {
  // Fake authen
  const isAuthenticated = true
  const favorite = true
  const handleFavoriteClick = (e) => {
    e.preventDefault()
  }
  return (
    <Link to={`/heritage/${item._id}`} className='block group'>
      <div className='shadow-sm border rounded-lg bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col'>
        <div className='relative overflow-hidden'>
          <img src={item.image} alt={item.title} className='aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105' />
          {
            isAuthenticated && (
              <Button
                variant='ghost'
                size='icon'
                onClick={handleFavoriteClick}
                className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90'
              >
                <Heart size={20} className={cn('transition-colors', 
                  favorite ? 'fill-heritage text-heritage' : 'text-gray-500')} />
              </Button>
            )
          }
          <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-1/3 pointer-events-none'></div>
          <div className='absolute bottom-3 left-3'>
            <span className='text-primary-foreground bg-heritage/90 rounded-full px-2 py-1 text-xs'>{item.period}</span>
          </div>
        </div>
        <div className='p-4 flex flex-col flex-grow'>
          <h3 className='text-lg font-medium group-hover:text-heritage transition-colors line-clamp-1 mb-1'>{item.title}</h3>
          <p className='text-muted-foreground text-sm mb-2'>{item.location}</p>
          <p className='text-sm text-foreground/80 line-clamp-2'>{item.description}</p>
        </div>
      </div>
    </Link>
  )
}

export default HeritageCard
