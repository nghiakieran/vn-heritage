import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

import { selectCurrentUser } from '~/store/slices/authSlice'
import { useGetFavoritesByUserIdQuery } from '~/store/apis/favoritesSlice'
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
  const dispatch = useDispatch()
  
  const currentPage = useSelector(selectFavoritesCurrentPage)
  const itemsPerPage = useSelector(selectFavoritesItemsPerPage)
  
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
  
  const { handlePageChange, paginationButtons } = usePagination(totalPages, currentPage, setFavoritesPage)

  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage > totalPages) {
        dispatch(setFavoritesPage(totalPages))
      } else if (favoriteItems.length === 0 && currentPage > 1) {
        dispatch(setFavoritesPage(1))
      }
    }
  }, [totalPages, currentPage, favoriteItems.length, dispatch])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const isLoading = isFavoritesLoading || isFavoritesFetching
  const hasFavorites = favoriteItems.length > 0

  return (
    <div className='pt-navbar-mobile sm:pt-navbar'>
      <div className='lcn-container  min-h-screen'>
        <div className='text-center animate-fade-up '>
          {
            hasFavorites && (
              <>
                <h1 className='text-3xl sm:text-4xl font-medium text-heritage-dark mb-4'>
                  Khám phá những di tích bạn yêu thích
                </h1>
                <p className='text-muted-foreground max-w-2xl mx-auto'>
                  Lưu giữ và theo dõi những địa danh lịch sử, văn hóa mà bạn quan tâm nhất
                </p>
              </>
            )
          }
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
                    if (!newState && favoriteItems.length <= 1) {
                      if (currentPage > 1 && currentPage === totalPages) {
                        dispatch(setFavoritesPage(currentPage - 1))
                      } else {
                        setTimeout(() => refetch(), 300)
                      }
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
    </div>
  )
}

export default Favorites
