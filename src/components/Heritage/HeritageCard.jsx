import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

import { cn } from '~/lib/utils'
import { Button } from '~/components/common/ui/Button'
import { selectCurrentUser } from '~/store/slices/authSlice'
import { 
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation
} from '~/store/apis/favoritesSlice'
import { 
  selectIsFavorited, 
  setFavoriteStatus,
  selectIsFavoriteInitialized
} from '~/store/slices/favoriteSlice'

const CONFIG = {
  placeholderImage: '/images/placeholder.webp',
  fallbackImage: '/images/placeholder.webp'
}

const HeritageCard = ({ item, isFavorited: propIsFavorited, onFavoriteChange }) => {
  const { 
    _id, 
    name = '', 
    location = '', 
    description = '', 
    images = [],
    nameSlug = '' 
  } = item || {}

  const dispatch = useDispatch()
  const userInfo = useSelector(selectCurrentUser)
  const isAuthenticated = !!userInfo
  
  const isFavoritedFromStore = useSelector(selectIsFavorited(_id))
  const isFavoriteInitialized = useSelector(selectIsFavoriteInitialized)
  
  // State để theo dõi trạng thái yêu thích
  const [isFavorited, setIsFavorited] = useState(propIsFavorited || false)
  const [imgSrc, setImgSrc] = useState(images[0] || CONFIG.placeholderImage)
  
  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation()
  const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation()
  
  // Đồng bộ trạng thái yêu thích
  useEffect(() => {
    if (propIsFavorited !== undefined) {
      setIsFavorited(propIsFavorited)
    } else if (isFavoriteInitialized) {
      setIsFavorited(isFavoritedFromStore)
    }
  }, [propIsFavorited, isFavoritedFromStore, isFavoriteInitialized])
  
  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này')
      return
    }
    
    try {
      const newFavoritedState = !isFavorited
      setIsFavorited(newFavoritedState)
      dispatch(setFavoriteStatus({ 
        heritageId: _id, 
        isFavorited: newFavoritedState 
      }))
      
      if (newFavoritedState) {
        await addToFavorites({ 
          userId: userInfo._id, 
          heritageId: _id 
        }).unwrap()

        toast.success('Đã thêm vào danh sách yêu thích')
      } else {
        await removeFromFavorites({ 
          userId: userInfo._id, 
          heritageId: _id 
        }).unwrap()
        
        toast.success('Đã xóa khỏi danh sách yêu thích')
      }
      
      if (onFavoriteChange) {
        onFavoriteChange(newFavoritedState)
      }
    } catch (error) {
      // Rollback
      setIsFavorited(!isFavorited)
      dispatch(setFavoriteStatus({ 
        heritageId: _id, 
        isFavorited: !isFavorited 
      }))
      console.log(error)

      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  }
  
  const handleImageError = (e) => {
    e.currentTarget.onerror = null
    setImgSrc(CONFIG.fallbackImage)
  }

  if (!item) return null
  
  const isLoading = isAdding || isRemoving
  
  return (
    <Link to={`/heritage/${nameSlug}`} className='block group' aria-label={`Xem chi tiết ${name}`}>
        <div className='flex flex-col h-full overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-lg'>
        {/* Image section */}
        <div className='relative overflow-hidden'>
          <img 
            src={imgSrc}
            alt={`Hình ảnh của ${name}`}
            className='aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105' 
            loading='lazy'
            width='600'
            height='400'
            onError={handleImageError}
          />
          
          {/* Favorite button */}
          {isAuthenticated && (
            <Button
              variant='ghost'
              size='icon'
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90'
              aria-label={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'}
              aria-live='polite'
            >
              <Heart 
                size={20} 
                className={cn('transition-colors', 
                  isFavorited ? 'fill-heritage text-heritage' : 'text-gray-500',
                  isLoading && 'opacity-50'
                )} 
              />
            </Button>
          )}
          <div className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none'></div>
        </div>
        
        {/* Content section */}
        <div className='flex flex-col flex-grow p-4'>
          <h3 className='mb-1 text-lg font-medium line-clamp-1 group-hover:text-heritage transition-colors'>
            {name}
          </h3>
          {location && (
            <p className='mb-2 text-sm text-muted-foreground truncate'>{location}</p>
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
