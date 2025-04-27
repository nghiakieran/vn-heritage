import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/store/slices/authSlice';
import MainLayout from '~/layout/MainLayout';
import ScrollToTop from '~/components/common/ScrollToTop';
import privateRoutes from './privateRoutes';

// Lazy load public pages
const Home = lazy(() => import('~/pages/Home'));
const About = lazy(() => import('~/pages/About/About'));
const ChatHeritagePage = lazy(() => import('~/pages/ChatHeritagePage/ChatHeritagePage'));
const EmailVerification = lazy(() => import('~/pages/EmailVerification'));
const Favorites = lazy(() => import('~/pages/Favorites'));
const GenericMapExplorer = lazy(() => import('~/pages/GoogleMapHeritage/GenericMapExplorer'));
const HeritageDetail = lazy(() => import('~/pages/HeritageDetail/HeritageDetail'));
const Heritages = lazy(() => import('~/pages/Heritages'));
const Login = lazy(() => import('~/pages/Login'));
const Profile = lazy(() => import('~/pages/Profile'));
const Register = lazy(() => import('~/pages/Register'));
const NotFound = lazy(() => import('~/pages/NotFound'));

const PublicRoutes = ({ children, restricted }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;
  if (isAuthenticated && restricted) return <Navigate to="/" replace />;
  return children;
};

const PrivateRoutes = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  console.log('PrivateRoutes:', { isAuthenticated, isAdmin, user }); // Debug

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="heritages" element={<Heritages />} />
          <Route path="heritage/:nameSlug" element={<HeritageDetail />} />
          <Route path="chat/heritage/:nameSlug" element={<ChatHeritagePage />} />
          <Route path="explore" element={<GenericMapExplorer />} />

          {/* Restricted Routes */}
          <Route
            path="login"
            element={
              <PublicRoutes restricted={true}>
                <Login />
              </PublicRoutes>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoutes restricted={true}>
                <Register />
              </PublicRoutes>
            }
          />
          <Route
            path="authen-confirm"
            element={
              <PublicRoutes restricted={true}>
                <EmailVerification />
              </PublicRoutes>
            }
          />

          {/* Private Routes (User) */}
          <Route
            path="profile"
            element={
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            }
          />
          <Route
            path="favorites"
            element={
              <PrivateRoutes>
                <Favorites />
              </PrivateRoutes>
            }
          />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
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
  );
};

export default AppRoutes;
