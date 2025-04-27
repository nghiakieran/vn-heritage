import { BASE_URL } from "~/constants/fe.constant";
import { apiSlice } from "./apiSlice";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),

    getAllActiveUsers: builder.query({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let allUsers = [];
        let page = 1;
        const limit = 10;
        let hasMore = true;

        while (hasMore) {
          const result = await fetchWithBQ(`/users?page=${page}&limit=${limit}`);
          if (result.error) return { error: result.error };

          allUsers = [...allUsers, ...result.data.users];
          hasMore = page < result.data.pagination.totalPages;
          page++;
        }

        const activeUsers = allUsers.filter(
          (user) => user.account && user.account.isActive === true
        );

        return { data: { users: activeUsers } };
      },
      providesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],

    }),

    getUserProfile: builder.query({
      query: () => ({
        url: `${BASE_URL}/users/profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),


    uploadAvatar: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/users/upload`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});
export const { useGetAllUsersQuery, useGetAllActiveUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useUploadAvatarMutation, useGetUserProfileQuery } = userSlice
