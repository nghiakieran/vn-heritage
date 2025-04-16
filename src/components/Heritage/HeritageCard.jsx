import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { cn } from '~/lib/utils'
import { Button } from '~/components/common/ui/Button'

const HeritageCard = ({ item }) => {
  // fallback
  const { 
    _id, 
    name = '', 
    location = '', 
    description = '', 
    images = [] 
  } = item || {}
  
  // Fake authen
  const isAuthenticated = true
  const favorite = true
  
  const handleFavoriteClick = (e) => {
    e.preventDefault()
    // Xử lý logic yêu thích
  }
  
  if (!item) return null
  
  return (
    <Link to={`/heritage/${_id}`} className='block group'>
      <div className='shadow-sm border rounded-lg bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col'>
        {/* Image section */}
        <div className='relative overflow-hidden'>
          {images[0] && (
            <img 
              src={images[0] || 'https://placehold.co/600x400?text=Di+t%C3%ADch+L%E1%BB%8Bch+s%E1%BB%AD&font=roboto'} 
              alt={name} 
              className='aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105' 
              loading='lazy'
            />
          )}
          
          {/* Favorite button */}
          {isAuthenticated && (
            <Button
              variant='ghost'
              size='icon'
              onClick={handleFavoriteClick}
              className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90'
              aria-label={favorite ? 'Bỏ yêu thích' : 'Yêu thích'}
            >
              <Heart 
                size={20} 
                className={cn('transition-colors', 
                  favorite ? 'fill-heritage text-heritage' : 'text-gray-500')} 
              />
            </Button>
          )}
          
          {/* Gradient overlay */}
          <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-1/3 pointer-events-none'></div>
        </div>
        
        {/* Content section */}
        <div className='p-4 flex flex-col flex-grow'>
          <h3 className='text-lg font-medium group-hover:text-heritage transition-colors line-clamp-1 mb-1'>
            {name}
          </h3>
          {location && (
            <p className='text-muted-foreground text-sm mb-2'>{location}</p>
          )}
          {description && (
            <p className='text-sm text-foreground/80 line-clamp-2'>{description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default HeritageCard
