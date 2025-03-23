import HeritageDetail from "../pages/HeritageDetail"
import Heritages from "../pages/Heritages"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/heritages', element: <Heritages /> },
  { path: '/heritage/:id', element: <HeritageDetail /> },
  { path: '/login', element: <Login />, restricted: true },
  { path: '/register', element: <Register />, restricted: true }
]

export default publicRoutes
