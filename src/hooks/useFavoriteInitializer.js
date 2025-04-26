import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/slices/authSlice'
import { useGetFavoritesByUserIdQuery } from '~/store/apis/favoriteApi'
import { selectIsFavoriteInitialized } from '~/store/slices/favoriteSlice'

/**
 * Hook để khởi tạo danh sách yêu thích khi người dùng đã đăng nhập
 */
export const useFavoriteInitializer = () => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  const isInitialized = useSelector(selectIsFavoriteInitialized)

  // Lấy danh sách yêu thích khi người dùng đã đăng nhập
  // và chưa khởi tạo danh sách yêu thích
  useGetFavoritesByUserIdQuery(
    { userId: user?._id, page: 1, limit: 50 },
    {
      skip: !isAuthenticated || isInitialized,
      refetchOnMountOrArgChange: true
    }
  )

  return { isAuthenticated, isInitialized }
}
