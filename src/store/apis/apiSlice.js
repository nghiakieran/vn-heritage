import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '~/constants/fe.constant'
import { logOut, setCredentials } from '../slices/authSlice'

const AUTH_URLS = [
  '/users/auth/register',
  '/users/auth/',
  '/users/auth/logout',
  '/users/auth/refresh-token',
]

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const authState = getState().auth;

    const token = authState.token;
    const userId = authState.userInfo?._id;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (userId && !AUTH_URLS.some((url) => endpoint.includes(url))) {
      headers.set('x-client-id', userId);
    }

    return headers;
  },
  timeout: 30000,
})

const baseQueryWithAuth = async (args, api, extraOptions) => {
  try {
    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.status === 401 || result?.error?.status === 410) {
      const { token, userInfo } = api.getState().auth
      const isLoggedIn = token && userInfo
      console.log(args.url);
      const shouldSkipAuthCheck = AUTH_URLS.some((url) =>
        args.url.includes(url)
      )

      if (isLoggedIn && !shouldSkipAuthCheck) {
        window.isRefreshing = true
        try {
          const refreshResult = await baseQuery(
            {
              url: '/users/auth/refresh-token',
              method: 'POST',
            },
            api,
            extraOptions
          )
          console.log(refreshResult);
          window.isRefreshing = false
          if (refreshResult?.data) {
            api.dispatch(
              setCredentials({
                user: userInfo,
                accessToken: refreshResult.data?.accessToken,
              })
            )
            // Retry the original query with the new token
            return await baseQuery(args, api, extraOptions)
          } else {
            // Refresh failed, logout the user
            await baseQuery(
              {
                url: '/users/auth/logout',
                method: 'POST',
              },
              api,
              extraOptions
            )
            api.dispatch(logOut())
            return result
          }
        } catch (refreshError) {
          console.error('Error during token refresh:', refreshError)
          window.isRefreshing = false
          api.dispatch(logOut())
          return result
        }
      }
    }

    // Log non-401 errors
    if (result.error && result.error.status !== 401) {
      const { status, data } = result.error
      const errorMessage = data?.message || 'Đã xảy ra lỗi'

      switch (status) {
        case 403:
          console.warn('Không có quyền truy cập:', errorMessage)
          break
        case 404:
          console.warn('Không tìm thấy tài nguyên:', errorMessage)
          break
        case 429:
          console.warn(
            'Quá nhiều yêu cầu, vui lòng thử lại sau:',
            errorMessage
          )
          break
        case 500:
        case 502:
        case 503:
          console.error('Lỗi máy chủ:', errorMessage)
          break
        default:
          if (!status) {
            console.error(
              'Lỗi kết nối mạng, vui lòng kiểm tra kết nối của bạn'
            )
          }
          break
      }
    }

    return result
  } catch (unexpectedError) {
    console.error('Lỗi không mong muốn trong interceptor:', unexpectedError)
    return {
      error: { status: 'FETCH_ERROR', error: 'Lỗi kết nối không mong muốn' },
    }
  }
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User', 'Heritage'],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: false,
  refetchOnReconnect: true,
  endpoints: () => ({}),
})