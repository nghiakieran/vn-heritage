import { apiSlice } from './apiSlice';
import { BASE_URL } from '~/constants/fe.constant';

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAll: builder.query({
      query: ({ page = 1, limit = 10, search = '', sort, order }) => ({
        url: `${BASE_URL}/users/`,
        method: 'GET',
        params: { page, limit, search, sort, order },
      }),
      providesTags: ['Users'],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${BASE_URL}/users/${id}`, // Sửa URL để dùng BASE_URL
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `${BASE_URL}/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        'Users',
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAllQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userSlice;