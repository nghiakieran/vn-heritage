import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { selectCurrentUser } from '~/store/slices/authSlice'
import { useGetFavoritesByUserIdQuery } from '~/store/apis/favoriteApi'
import HeritageCard from '~/components/Heritage/HeritageCard'
import { Button } from '~/components/common/ui/Button'
import HeritageSkeleton from '~/components/Heritage/HeritageSkeleton'
import { usePagination } from '~/hooks/usePagination'
import { Pagination } from '~/components/common/Pagination'
import { setFavoritesPage } from '~/store/slices/paginationSlice'
import {
  selectFavoritesCurrentPage,
  selectFavoritesItemsPerPage
} from '~/store/selectors/paginationSelectors'

const Favorites = () => {
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  
  const currentPage = useSelector(selectFavoritesCurrentPage)
  const itemsPerPage = useSelector(selectFavoritesItemsPerPage)
console.log('currentPage', currentPage)  // Kiểm tra giá trị

  
  const {
    data: favoritesData,
    isLoading: isFavoritesLoading,
    error: favoritesError,
    isFetching: isFavoritesFetching,
    refetch
  } = useGetFavoritesByUserIdQuery({ 
    userId: user?._id, 
    page: currentPage,
    limit: itemsPerPage 
  }, { 
    skip: !isAuthenticated 
  })

  const favoriteItems = favoritesData?.items || []
  const totalPages = favoritesData?.pagination?.totalPages || 1
  console.log(favoritesData);

  const { 
    handlePageChange, 
    paginationButtons,
    setCurrentPage
  } = usePagination(totalPages, currentPage, setFavoritesPage)

  useEffect(() => {
    if (totalPages > 0) {
      // Nếu currentPage lớn hơn totalPages, chuyển về trang cuối cùng
      if (currentPage > totalPages) {
        setCurrentPage(totalPages)
      } 
      // Nếu trang hiện tại không có dữ liệu nhưng vẫn còn trang khác
      else if (favoriteItems.length === 0 && currentPage > 1) {
        setCurrentPage(1)
      }
    }
  }, [totalPages, currentPage, favoriteItems.length, setCurrentPage])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const isLoading = isFavoritesLoading || isFavoritesFetching
  const hasFavorites = favoriteItems.length > 0

  return (
    <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-medium text-heritage-dark flex items-center'>
          <Heart className='mr-2 h-6 w-6 text-heritage' />
          Di tích yêu thích
        </h1>
      </div>

      {favoritesError && (
        <div className='text-center py-4 text-red-500'>
          <p className='font-medium'>Có lỗi xảy ra khi tải danh sách yêu thích</p>
          <p className='text-sm mt-2'>
            {favoritesError.status === 404
              ? 'Bạn chưa có danh sách yêu thích nào.'
              : favoritesError.data?.message || 'Vui lòng thử lại sau.'}
          </p>
        </div>
      )}

      {isLoading ? (
        <HeritageSkeleton count={itemsPerPage} />
      ) : hasFavorites ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {favoriteItems.map((item) => (
              <HeritageCard 
                key={item._id} 
                item={item} 
                isFavorited={true}
                onFavoriteChange={(newState) => {
                  // Nếu un-favorite item cuối cùng trên trang, làm mới dữ liệu
                  // hoặc nếu danh sách hết item trên trang hiện tại
                  if (!newState && favoriteItems.length <= 1) {
                    setTimeout(() => refetch(), 300)
                  }
                }} 
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginationButtons={paginationButtons}
              handlePageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </>
      ) : (
        <div className='text-center py-12 space-y-4'>
          <Heart className='h-16 w-16 mx-auto text-muted-foreground' />
          <h2 className='text-xl font-medium'>Chưa có di tích yêu thích</h2>
          <p className='text-muted-foreground max-w-md mx-auto mb-6'>
            Khám phá các di tích lịch sử và thêm vào danh sách yêu thích của bạn để xem lại sau.
          </p>
          <Button onClick={() => navigate('/heritages')}>Khám phá di tích</Button>
        </div>
      )}
    </div>
  )
}

export default Favorites

// import { Heart } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
// import { useSelector, useDispatch } from 'react-redux'
// import { useEffect } from 'react'

// import { selectCurrentUser } from '~/store/slices/authSlice'
// import { useGetFavoritesByUserIdQuery } from '~/store/apis/favoriteApi'
// import HeritageCard from '~/components/Heritage/HeritageCard'
// import { Button } from '~/components/common/ui/Button'
// import HeritageSkeleton from '~/components/Heritage/HeritageSkeleton'
// import { usePagination } from '~/hooks/usePagination'
// import { Pagination } from '~/components/common/Pagination'
// import { setFavoritesPage } from '~/store/slices/paginationSlice'
// import {
//   selectFavoritesCurrentPage,
//   selectFavoritesItemsPerPage
// } from '~/store/selectors/paginationSelectors'
// import { setFavorites } from '~/store/slices/favoriteSlice'

// const Favorites = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const user = useSelector(selectCurrentUser)
//   const isAuthenticated = !!user

//   const currentPage = useSelector(selectFavoritesCurrentPage)
//   const itemsPerPage = useSelector(selectFavoritesItemsPerPage)

//   const {
//     data: favoritesData,
//     isLoading: isFavoritesLoading,
//     error: favoritesError,
//     isFetching: isFavoritesFetching,
//     refetch
//   } = useGetFavoritesByUserIdQuery({
//     userId: user?._id,
//     page: currentPage,
//     limit: itemsPerPage
//   }, {
//     skip: !isAuthenticated
//   })

//   const favoriteItems = favoritesData?.items || []
//   const totalPages = favoritesData?.pagination?.totalPages || 1

//   const {
//     handlePageChange,
//     paginationButtons,
//     setCurrentPage
//   } = usePagination(totalPages, currentPage, setFavoritesPage)

//   useEffect(() => {
//     if (totalPages > 0) {
//       if (currentPage > totalPages) {
//         setCurrentPage(totalPages)
//       } else if (favoriteItems.length === 0 && currentPage > 1) {
//         setCurrentPage(1)
//       }
//     }
//   }, [totalPages, currentPage, favoriteItems.length, setCurrentPage])

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login')
//     }
//   }, [isAuthenticated, navigate])

//   useEffect(() => {
//     if (favoritesData?.items) {
//       const ids = favoritesData.items.map(item => item._id)
//       dispatch(setFavorites(ids))
//     }
//   }, [favoritesData, dispatch])

//   if (!isAuthenticated) return null

//   const isLoading = isFavoritesLoading || isFavoritesFetching
//   const hasFavorites = favoriteItems.length > 0

//   return (
//     <div className='container max-w-7xl mx-auto px-4 sm:px-6 py-8'>
//       <div className='flex justify-between items-center mb-8'>
//         <h1 className='text-2xl font-medium text-heritage-dark flex items-center'>
//           <Heart className='mr-2 h-6 w-6 text-heritage' />
//           Di tích yêu thích
//         </h1>
//       </div>

//       {favoritesError && (
//         <div className='text-center py-4 text-red-500'>
//           <p className='font-medium'>Có lỗi xảy ra khi tải danh sách yêu thích</p>
//           <p className='text-sm mt-2'>
//             {favoritesError.status === 404
//               ? 'Bạn chưa có danh sách yêu thích nào.'
//               : favoritesError.data?.message || 'Vui lòng thử lại sau.'}
//           </p>
//         </div>
//       )}

//       {isLoading ? (
//         <HeritageSkeleton count={itemsPerPage} />
//       ) : hasFavorites ? (
//         <>
//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//             {favoriteItems.map((item) => (
//               <HeritageCard
//                 key={item._id}
//                 item={item}
//                 onFavoriteChange={(newState) => {
//                   if (!newState && favoriteItems.length <= 1) {
//                     setTimeout(() => refetch(), 300)
//                   }
//                 }}
//               />
//             ))}
//           </div>

//           {totalPages > 1 && (
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               paginationButtons={paginationButtons}
//               handlePageChange={handlePageChange}
//               isLoading={isLoading}
//             />
//           )}
//         </>
//       ) : (
//         <div className='text-center py-12 space-y-4'>
//           <Heart className='h-16 w-16 mx-auto text-muted-foreground' />
//           <h2 className='text-xl font-medium'>Chưa có di tích yêu thích</h2>
//           <p className='text-muted-foreground max-w-md mx-auto mb-6'>
//             Khám phá các di tích lịch sử và thêm vào danh sách yêu thích của bạn để xem lại sau.
//           </p>
//           <Button onClick={() => navigate('/heritages')}>Khám phá di tích</Button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Favorites
