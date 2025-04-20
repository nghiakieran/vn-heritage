import { Navigate, Route, Routes } from 'react-router-dom'
import publicRoutes from './publicRoutes'
import privateRoutes from './privateRoutes'
import adminRoutes from './adminRoutes'
import NotFound from '~/pages/NotFound'
import MainLayout from '~/layout/MainLayout'
import AdminLayout from '~/layout/AdminLayout'

const PublicRoutes = ({ children, restricted }) => {
  const user = false // test
  if (user && restricted) return <Navigate to='/' replace />
  return children
}

const PrivateRoutes = ({ children }) => {
  const user = false // test
  if (!user) return <Navigate to='/login' replace />
  return children
}

const AdminRoutes = ({ children }) => {
  const isAdmin = true // test
  if (!isAdmin) return <Navigate to='/login' replace />
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path='/' element={<MainLayout />}>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element, restricted }) => (
          <Route
            key={path}
            path={path}
            element={<PublicRoutes restricted={restricted}>{element}</PublicRoutes>}
          />
        ))}
        {/* Private Routes */}
        {privateRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoutes>{element}</PrivateRoutes>}
          />
        ))}
      </Route>

      {/* Admin Routes */}
      <Route path='/admin' element={<AdminLayout />}>
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<AdminRoutes>{element}</AdminRoutes>}
          />
        ))}
      </Route>

      {/* Not Found */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
