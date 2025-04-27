import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { logOut, selectCurrentUser } from '~/store/slices/authSlice';
import { Button } from '~/components/common/ui/Button';
import {
  Menu,
  LogOut,
  Users,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectCurrentUser);
  const isAuthenticated = !!userInfo;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    try {
      dispatch(logOut())
      toast.success('Đăng xuất thành công!')
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Đăng xuất thất bại. Vui lòng thử lại!')
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { name: 'Quản lý Người dùng', path: '/admin/users', icon: <Users className='w-5 h-5' /> },
    { name: 'Quản lý Di tích', path: '/admin/heritages', icon: <Users className='w-5 h-5' /> },
    { name: 'Quản lý Bài kiểm tra', path: '/admin/knowledge-tests', icon: <BookOpen className='w-5 h-5' /> },
    { name: 'Cài đặt', path: '/admin/settings', icon: <Settings className='w-5 h-5' /> },
  ];

  return (
    <div className='flex h-screen bg-gray-100'>
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-16'
          } bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className='flex items-center justify-between p-4 border-b'>
          {isSidebarOpen && <h2 className='text-xl font-semibold'>Admin Dashboard</h2>}
          <Button variant='ghost' onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        <nav className='flex-1 p-4'>
          <ul>
            <li className='mb-2'>
              <Link to='/'>
                <Button variant='ghost' className='w-full justify-start'>
                  <Home className='w-5 h-5 mr-2' />
                  {isSidebarOpen && <span>Trang chủ</span>}
                </Button>
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.name} className='mb-2'>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => navigate(item.path)}
                >
                  <span className='mr-2'>{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        {isSidebarOpen && (
          <div className='p-4 border-t'>
            <Button variant='destructive' className='w-full' onClick={handleLogout}>
              <LogOut className='w-5 h-5 mr-2' /> Đăng xuất
            </Button>
          </div>
        )}
      </aside>

      <div className='flex-1 flex flex-col'>
        <header className='bg-white shadow-sm p-4 flex justify-between items-center'>
          <div className='flex items-center'>
            <Button variant='ghost' onClick={toggleSidebar} className='mr-4'>
              <Menu className='w-6 h-6' />
            </Button>
            <h1 className='text-xl font-semibold'>Quản trị hệ thống</h1>
          </div>
          <div className='flex items-center space-x-4'>
            <Link to='/'>
              <Button variant='ghost' size='sm'>
                <Home className='w-5 h-5 mr-2' />
                <span>Trang chủ</span>
              </Button>
            </Link>
            <span className='text-sm'>{userInfo?.name || 'Admin'}</span>
            <img
              src='/images/profile.jpg'
              alt='Avatar'
              className='w-10 h-10 rounded-full'
            />
          </div>
        </header>

        <main className='flex-1 p-6 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;