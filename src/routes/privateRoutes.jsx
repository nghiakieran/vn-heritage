import { Navigate } from "react-router-dom"
import AdminLayout from "~/layout/AdminLayout"
import AddHeritage from "~/pages/Admin/Heritage/AddHeritage"
import HeritageDetail from "~/pages/Admin/Heritage/HeritageDetail"
import HeritageManagement from "~/pages/Admin/Heritage/HeritageManagement"
import AddKnowledgeTest from "~/pages/Admin/Knowledge/AddKnowledgeTest"
import KnowledgeTestManagement from "~/pages/Admin/Knowledge/KnowledgeTestManagement"
import UpdateKnowledgeTest from "~/pages/Admin/Knowledge/UpdateKnowledgeTest"
import UserDetail from "~/pages/Admin/User/UserDetail"
import UserManagement from "~/pages/Admin/User/UserManagement"


const privateRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <Navigate to="/admin/users" replace /> },
      { path: "users", element: <UserManagement /> },
      { path: "users/:id", element: <UserDetail /> },
      { path: "heritages", element: <HeritageManagement /> },
      { path: "/admin/heritages/new", element: <AddHeritage /> },
      { path: "/admin/heritages/:id", element: <HeritageDetail /> },
      { path: "/admin/knowledge-tests", element: <KnowledgeTestManagement /> },
      { path: "/admin/knowledge-tests/new", element: <AddKnowledgeTest /> },
      { path: "/admin/knowledge-tests/:id", element: <UpdateKnowledgeTest /> },
      { path: "/admin/knowledge-tests/edit/:id", element: <UpdateKnowledgeTest /> },
    ],
  },
]

export default privateRoutes
