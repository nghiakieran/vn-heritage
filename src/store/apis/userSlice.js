import { BASE_URL } from '~/constants/fe.constant'
import { apiSlice } from './apiSlice'

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADMIN: Lấy tất cả users (có phân trang, search, sort)
    getAll: builder.query({
      query: ({ page = 1, limit = 10, search = '', sort, order }) => ({
        url: `${BASE_URL}/users/`,
        method: 'GET',
        params: { page, limit, search, sort, order },
      }),
      providesTags: ['Users'],
    }),

    // ADMIN: Lấy 1 user theo id
    getUserById: builder.query({
      query: (id) => ({
        url: `${BASE_URL}/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // ADMIN: Cập nhật user theo id
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `${BASE_URL}/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }, 'Users'],
    }),

    // ADMIN: Xoá user theo id
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // CLIENT: Lấy profile của user đang login
    getUserProfile: builder.query({
      query: () => ({
        url: `${BASE_URL}/users/profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // CLIENT: Update profile (không phải theo id mà là user đang login)
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // CLIENT: Upload avatar
    uploadAvatar: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/upload`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // CLIENT: Lấy tất cả active users
    getAllActiveUsers: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let allUsers = []
        let page = 1
        const limit = 10
        let hasMore = true

        while (hasMore) {
          const result = await fetchWithBQ(`/users?page=${page}&limit=${limit}`)
          if (result.error) return { error: result.error }

          allUsers = [...allUsers, ...result.data.users]
          hasMore = page < result.data.pagination.totalPages
          page++
        }

        const activeUsers = allUsers.filter(
          (user) => user.account && user.account.isActive === true
        )

        return { data: { users: activeUsers } }
      },
      providesTags: ['User'],
    }),
  }),
})

// Export hooks
export const {
  useGetAllQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadAvatarMutation,
  useGetAllActiveUsersQuery,
} = userSlice

