import About from '~/pages/About/About'
import ChatHeritagePage from '~/pages/ChatHeritagePage/ChatHeritagePage'
import EmailVerification from '~/pages/EmailVerification'
import HeritageDetail from '~/pages/HeritageDetail/HeritageDetail'
import Heritages from '~/pages/Heritages'
import Home from '~/pages/Home'
import Login from '~/pages/Login'
import Profile from '~/pages/Profile'
import Register from '~/pages/Register'

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/heritages', element: <Heritages /> },
  { path: '/heritage/:nameSlug', element: <HeritageDetail /> },
  { path: '/login', element: <Login />, restricted: true },
  { path: '/register', element: <Register />, restricted: true },
  { path: '/authen-confirm', element: <EmailVerification />, restricted: true },
  { path: '/chat/heritage/:nameSlug', element: <ChatHeritagePage />},
  { path: '/profile', element: <Profile />}
]

export default publicRoutes
