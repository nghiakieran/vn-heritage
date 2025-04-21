import About from '~/pages/About/About'
import EmailVerification from '~/pages/EmailVerification'
import HeritageDetail from '~/pages/HeritageDetail/HeritageDetail'
import Heritages from '~/pages/Heritages'
import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Register from '~/pages/Register'

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/heritages', element: <Heritages /> },
  { path: '/heritage/:id', element: <HeritageDetail /> },
  { path: '/login', element: <Login />, restricted: true },
  { path: '/register', element: <Register />, restricted: true },
  { path: '/authen-confirm', element: <EmailVerification />, restricted: true }
]

export default publicRoutes
