import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/common/ui/Button'
import { selectCurrentUser } from '~/store/slices/authSlice'
import { 
  useAddToFavoritesMutation, 
  useRemoveFavoriteMutation,
} from '~/store/apis/favoriteApi'
import { toast } from 'react-toastify'

const HeritageCard = ({ item, isFavorited = false, onFavoriteChange  }) => {
  const { _id, name = '', location = '', description = '', images = [], nameSlug = '' } = item || {}
  const userInfo = useSelector(selectCurrentUser)
  const isAuthenticated = !!userInfo

  const [isFavoritedLocal, setIsFavoritedLocal] = useState(isFavorited)
  
  useEffect(() => {
    setIsFavoritedLocal(isFavoritedLocal)
  }, [isFavoritedLocal])

  const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation()
  const [removeFavorite, { isLoading: isRemoving }] = useRemoveFavoriteMutation()

  const isLoading = isAdding || isRemoving
  console.log(isFavoritedLocal);
  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thực hiện chức năng này')
      return
    }

    if (isLoading) return

    const prev = isFavoritedLocal
    setIsFavoritedLocal(!prev)

    try {
      if (isFavoritedLocal) {
        await removeFavorite({ userId: userInfo._id, heritageId: _id })
        toast.success('Đã xóa khỏi danh sách yêu thích')
        if (onFavoriteChange) onFavoriteChange(false)
      } else {
        const response = await addToFavorites({ userId: userInfo._id, heritageId: _id })

        if (response.error) throw response.error
        toast.success('Đã thêm vào danh sách yêu thích')
        if (onFavoriteChange) onFavoriteChange(true)
      }
    } catch (error) {
      setIsFavoritedLocal(prev)
      console.error('Favorite action error:', error)

      if (error.status === 422) {
        toast.error('Dữ liệu không hợp lệ. Vui lòng thử lại sau.')
      } else if (error.status === 404) {
        toast.error('Không tìm thấy di tích hoặc danh sách yêu thích.')
      } else if (error.status === 400) {
        if (error.data?.message?.includes('already exists in favorites')) {
          toast.info('Di tích đã có trong danh sách yêu thích của bạn.')
        } else {
          toast.error('Yêu cầu không hợp lệ. Vui lòng thử lại sau.')
        }
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
      }
    }
  }

  if (!item) return null

  return (
    <Link to={`/heritage/${nameSlug}`} className='block group'>
      <div className='shadow-sm border rounded-lg bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col'>
        <div className='relative overflow-hidden'>
          <img
            src={images[0] || 'https://placehold.co/600x400?text=Di+t%C3%ADch+L%E1%BB%8Bch+s%E1%BB%AD&font=roboto'}
            alt={name}
            className='aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105'
            loading='lazy'
          />

          {isAuthenticated && (
            <Button
              variant='ghost'
              size='icon'
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90'
              aria-label={isFavoritedLocal ? 'Bỏ yêu thích' : 'Yêu thích'}
            >
              {isLoading ? (
                <div className='w-5 h-5 border-2 border-heritage border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <Heart
                  size={20}
                  className={cn(
                    'transition-colors',
                    isFavoritedLocal ? 'fill-heritage text-heritage' : 'text-gray-500',
                  )}
                />
              )}
            </Button>
          )}

          <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-1/3 pointer-events-none'></div>
        </div>

        <div className='p-4 flex flex-col flex-grow'>
          <h3 className='text-lg font-medium group-hover:text-heritage transition-colors line-clamp-1 mb-1'>{name}</h3>
          {location && <p className='text-muted-foreground text-sm mb-2'>{location}</p>}
          {description && <p className='text-sm text-foreground/80 line-clamp-2'>{description}</p>}
        </div>
      </div>
    </Link>
  )
}

export default HeritageCard

// import { Heart } from 'lucide-react'
// import { Link } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { toast } from 'react-toastify'

// import { cn } from '~/lib/utils'
// import { Button } from '~/components/common/ui/Button'
// import { selectCurrentUser } from '~/store/slices/authSlice'
// import {
//   useAddToFavoritesMutation,
//   useRemoveFavoriteMutation,
// } from '~/store/apis/favoriteApi'
// import {
//   selectIsFavorited,
//   toggleFavorite
// } from '~/store/slices/favoriteSlice'

// const HeritageCard = ({ item, onFavoriteChange }) => {
//   const dispatch = useDispatch()
//   const { _id, name = '', location = '', description = '', images = [], nameSlug = '' } = item || {}
//   const userInfo = useSelector(selectCurrentUser)
//   const isAuthenticated = !!userInfo

//   const [addToFavorites, { isLoading: isAdding }] = useAddToFavoritesMutation()
//   const [removeFavorite, { isLoading: isRemoving }] = useRemoveFavoriteMutation()
//   const isLoading = isAdding || isRemoving

//   const isFavorited = useSelector(selectIsFavorited(_id))

//   const handleFavoriteClick = async (e) => {
//     e.preventDefault()
//     e.stopPropagation()

//     if (!isAuthenticated) {
//       toast.error('Vui lòng đăng nhập để thực hiện chức năng này')
//       return
//     }

//     if (isLoading) return

//     try {
//       if (isFavorited) {
//         await removeFavorite({ userId: userInfo._id, heritageId: _id })
//         dispatch(toggleFavorite(_id))
//         toast.success('Đã xóa khỏi danh sách yêu thích')
//         if (onFavoriteChange) onFavoriteChange(false)
//       } else {
//         const response = await addToFavorites({ userId: userInfo._id, heritageId: _id })
//         if (response.error) throw response.error
//         dispatch(toggleFavorite(_id))
//         toast.success('Đã thêm vào danh sách yêu thích')
//         if (onFavoriteChange) onFavoriteChange(true)
//       }
//     } catch (error) {
//       console.error('Favorite action error:', error)
//       toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
//     }
//   }

//   if (!item) return null

//   return (
//     <Link to={`/heritage/${nameSlug}`} className='block group'>
//       <div className='shadow-sm border rounded-lg bg-card text-card-foreground overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col'>
//         <div className='relative overflow-hidden'>
//           <img
//             src={images[0] || 'https://placehold.co/600x400?text=Di+tích+Lịch+sử&font=roboto'}
//             alt={name}
//             className='aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-105'
//             loading='lazy'
//           />

//           {isAuthenticated && (
//             <Button
//               variant='ghost'
//               size='icon'
//               onClick={handleFavoriteClick}
//               disabled={isLoading}
//               className='absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white/90'
//               aria-label={isFavorited ? 'Bỏ yêu thích' : 'Yêu thích'}
//             >
//               {isLoading ? (
//                 <div className='w-5 h-5 border-2 border-heritage border-t-transparent rounded-full animate-spin'></div>
//               ) : (
//                 <Heart
//                   size={20}
//                   className={cn(
//                     'transition-colors',
//                     isFavorited ? 'fill-heritage text-heritage' : 'text-gray-500',
//                   )}
//                 />
//               )}
//             </Button>
//           )}

//           <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-1/3 pointer-events-none'></div>
//         </div>

//         <div className='p-4 flex flex-col flex-grow'>
//           <h3 className='text-lg font-medium group-hover:text-heritage transition-colors line-clamp-1 mb-1'>{name}</h3>
//           {location && <p className='text-muted-foreground text-sm mb-2'>{location}</p>}
//           {description && <p className='text-sm text-foreground/80 line-clamp-2'>{description}</p>}
//         </div>
//       </div>
//     </Link>
//   )
// }

// export default HeritageCard
