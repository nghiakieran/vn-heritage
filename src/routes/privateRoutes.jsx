import { Navigate } from 'react-router-dom';
import AdminLayout from '~/layout/AdminLayout';
import UserManagement from '~/pages/Admin/UserManagement';
import UserDetail from '~/pages/Admin/UserDetail';
import HeritageManagement from '~/pages/Admin/HeritageManagement';
import AddHeritage from '~/pages/Admin/AddHeritage';
import HeritageDetail from '~/pages/Admin/HeritageDetail';
// import KnowledgeTestManagement from '~/pages/Admin/KnowledgeTestManagement';
// import KnowledgeTestDetail from '~/pages/Admin/KnowledgeTestDetail';

const privateRoutes = [
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { path: '', element: <Navigate to="/admin/users" replace /> },
            { path: 'users', element: <UserManagement /> },
            { path: 'users/:id', element: <UserDetail /> },
            { path: 'heritages', element: <HeritageManagement /> },
            { path: '/admin/heritages/new', element: <AddHeritage /> },
            { path: '/admin/heritages/:id', element: <HeritageDetail /> },
            // { path: 'knowledge-tests', element: <KnowledgeTestManagement /> },
            // { path: 'knowledge-tests/:id', element: <KnowledgeTestDetail /> },
            // { path: 'settings', element: <div>Cài đặt (Chưa triển khai)</div> },
        ],
    },
];

export default privateRoutes;