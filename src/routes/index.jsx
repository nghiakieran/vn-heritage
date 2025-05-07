import { Route, Routes } from 'react-router-dom'
import { lazy } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/store/slices/authSlice'
import MainLayout from '~/layout/MainLayout'
import ScrollToTop from '~/components/common/ScrollToTop'
import publicRoutes from './publicRoutes'
import privateRoutes from './privateRoutes'

// Lazy load public pages
const Home = lazy(() => import('~/pages/Home'))
const About = lazy(() => import('~/pages/About/About'))
const ChatHeritagePage = lazy(() => import('~/pages/ChatHeritagePage/ChatHeritagePage'))
const EmailVerification = lazy(() => import('~/pages/EmailVerification'))
const Favorites = lazy(() => import('~/pages/Favorites'))
const GenericMapExplorer = lazy(() => import('~/pages/GoogleMapHeritage/GenericMapExplorer'))
const HeritageDetail = lazy(() => import('~/pages/HeritageDetail/HeritageDetail'))
const Heritages = lazy(() => import('~/pages/Heritages'))
const Login = lazy(() => import('~/pages/Login'))
const Profile = lazy(() => import('~/pages/Profile'))
const Register = lazy(() => import('~/pages/Register'))
const NotFound = lazy(() => import('~/pages/NotFound'))
const ForgotPassword = lazy(() => import('~/pages/ForgotPassword'))

// Map route paths to lazy-loaded components
const routeComponents = {
  '/': <Home />,
  '/about': <About />,
  '/heritages': <Heritages />,
  '/heritage/:nameSlug': <HeritageDetail />,
  '/login': <Login />,
  '/register': <Register />,
  '/authen-confirm': <EmailVerification />,
  '/chat/heritage/:nameSlug': <ChatHeritagePage />,
  '/profile': <Profile />,
  '/favorites': <Favorites />,
  '/explore': <GenericMapExplorer />,
  '/forgot-password': <ForgotPassword />,
}

const PublicRoutes = ({ children, restricted }) => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  if (isAuthenticated && restricted) {
    window.location.href = isAdmin ? '/admin' : '/'
    return null // Return null to prevent rendering children after redirect
  }
  return children
}

const UserPrivateRoutes = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user

  if (!isAuthenticated) {
    window.location.href = '/login'
    return null
  }
  return children
}

const PrivateRoutes = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'

  console.log('PrivateRoutes:', { isAuthenticated, isAdmin, user }) // Debug

  if (!isAuthenticated) {
    window.location.href = '/login'
    return null
  }
  if (!isAdmin) {
    window.location.href = '/'
    return null
  }
  return children
}

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path='/' element={<MainLayout />}>
          {publicRoutes.map(({ path, restricted }) => (
            <Route
              key={path}
              path={path}
              element={
                path === '/profile' || path === '/favorites' ? (
                  <UserPrivateRoutes>
                    {routeComponents[path] || <NotFound />}
                  </UserPrivateRoutes>
                ) : (
                  <PublicRoutes restricted={restricted}>
                    {routeComponents[path] || <NotFound />}
                  </PublicRoutes>
                )
              }
            />
          ))}
          <Route path='*' element={<NotFound />} />
        </Route>

        {/* Private Routes with AdminLayout */}
        {privateRoutes.map(({ path, element, children }) => (
          <Route
            key={path}
            path={path}
            element={<PrivateRoutes>{element}</PrivateRoutes>}
          >
            {children &&
              children.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={child.element}
                />
              ))}
          </Route>
        ))}
      </Routes>
    </>
  )
}

export default AppRoutes
