import { Navigate, Route, Routes } from 'react-router-dom'

import publicRoutes from './publicRoutes'
import privateRoutes from './privateRoutes'
import NotFound from '~/pages/NotFound'
import MainLayout from '~/layout/MainLayout'

const PublicRoutes = ({ children, restricted }) => {
  // Fake auth
  const user = false
  if (user && restricted) return <Navigate to='/' replace />
  return children
}

const PrivateRoutes = ({ children }) => {
  // Fake auth
  const user = false
  if (!user) return <Navigate to='/login' replace />
  return children
}

const AppRoutes = () => {
  return (
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
  )
}

export default AppRoutes
