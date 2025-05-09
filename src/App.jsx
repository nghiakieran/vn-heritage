import React, { useEffect, Suspense } from 'react'
import AppRoutes from './routes'
import { useDispatch } from 'react-redux'
import { setCredentials } from './store/slices/authSlice'
import ToastProvider from './components/ToastProvider/ToastProvider'
import { useFavoriteInitializer } from './hooks/useFavoriteInitializer'
import LoadingScreen from './components/common/LoadingScreen'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const user = localStorage.getItem('userInfo')

        if (token && user) {
          const parsedToken = JSON.parse(token)
          const parsedUser = JSON.parse(user)

          // Assuming your token object has an 'expiresAt' property (in milliseconds)
          if (parsedToken?.expiresAt > new Date().getTime()) {
            dispatch(
              setCredentials({
                user: parsedUser,
                accessToken: parsedToken.value,
              })
            )
          } else {
            localStorage.removeItem('userInfo')
            localStorage.removeItem('accessToken')
            // Optionally, redirect the user to the login page
          }
        }
      } catch (error) {
        console.error('Error parsing auth data:', error)
        localStorage.removeItem('userInfo')
        localStorage.removeItem('accessToken')
        // Optionally, redirect the user to the login page
      }
    }

    checkAuth()
  }, [dispatch])
  
  // Hook load favorites
  useFavoriteInitializer()
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AppRoutes />
      <ToastProvider />
    </Suspense>
  )
}

export default App
