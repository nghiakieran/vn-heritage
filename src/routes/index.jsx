import { Navigate, Route, Routes } from 'react-router-dom'

import publicRoutes from './publicRoutes'
import privateRoutes from './privateRoutes'
import NotFound from '~/pages/NotFound'
import MainLayout from '~/layout/MainLayout'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/slices/authSlice'
import ScrollToTop from '~/components/common/ScrollToTop'

const PublicRoutes = ({ children, restricted }) => {
  // Fake auth
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  // if (isAuthenticated && restricted) return <Navigate to='/' replace />
  return children
}

const PrivateRoutes = ({ children }) => {
  // Fake auth
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  if (!isAuthenticated) return <Navigate to='/login' replace />
  return children
}

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<MainLayout />}>
        {/* Public Routes */}
          {
            publicRoutes.map(({ path, element, restricted }) => (
              <Route
                key={path} path={path}
                element={<PublicRoutes restricted={restricted}>{element}</PublicRoutes>} 
              />
            ))
          }
        {/* Private Routes */}
          {
            privateRoutes.map(({ path, element }) => (
              <Route
                key={path} path={path} 
                element={<PrivateRoutes>{element}</PrivateRoutes>}
              />
            ))
          }
          {/* Not Found */}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default AppRoutes
