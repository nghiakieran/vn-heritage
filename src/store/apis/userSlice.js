import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '~/constants/fe.constant'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // timeout: 30000,
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    getAllActiveUsers: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let allUsers = []
        let page = 1
        const limit = 10 // Hoặc giá trị phù hợp
        let hasMore = true

        while (hasMore) {
          const result = await fetchWithBQ(`/users?page=${page}&limit=${limit}`)
          if (result.error) return { error: result.error }

          allUsers = [...allUsers, ...result.data.users]
          hasMore = page < result.data.pagination.totalPages
          page++
        }

        // Lọc tất cả người dùng có isActive = true
        const activeUsers = allUsers.filter(user =>
          user.account && user.account.isActive === true
        )

        return { data: { users: activeUsers } }
      },
      providesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useGetAllUsersQuery, useGetAllActiveUsersQuery, useUpdateUserMutation, useDeleteUserMutation } = userApi
