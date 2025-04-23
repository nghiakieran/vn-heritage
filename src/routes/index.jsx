import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/store/slices/authSlice';
import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';
import NotFound from '~/pages/NotFound';
import MainLayout from '~/layout/MainLayout';
import ScrollToTop from '~/components/common/ScrollToTop';

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
          {publicRoutes.map(({ path, element, restricted }) => (
            <Route
              key={path}
              path={path}
              element={<PublicRoutes restricted={restricted}>{element}</PublicRoutes>}
            />
          ))}
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