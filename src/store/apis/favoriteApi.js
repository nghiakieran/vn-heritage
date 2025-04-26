import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '~/constants/fe.constant'

export const favoriteApi = createApi({
  reducerPath: 'favoriteApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' }),
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    getFavoritesByUserId: builder.query({
      query: ({ userId, page = 1, limit = 9 }) => ({
        url: `/favorites/user/${userId}`,
        params: { page, limit }
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ _id }) => ({ type: 'Favorites', id: _id })),
            { type: 'Favorites', id: 'LIST' }
          ]
          : [{ type: 'Favorites', id: 'LIST' }],
      // Chuyển đổi response để thêm map heritageIds
      transformResponse: (response) => {
        if (response && response.items) {
          // Tạo map các heritageId đã yêu thích
          const favoriteMap = response.items.reduce((map, item) => {
            map[item._id] = true
            return map
          }, {})

          return {
            ...response,
            favoriteMap
          }
        }
        return response
      }
    }),

    addToFavorites: builder.mutation({
      query: ({ userId, heritageId }) => ({
        url: `/favorites/add-to-favorites`,
        method: 'POST',
        body: { userId, heritageId },
      }),
      invalidatesTags: [{ type: 'Favorites', id: 'LIST' }]
    }),

    removeFromFavorites: builder.mutation({
      query: ({ userId, heritageId }) => ({
        url: `/favorites/user/${userId}/heritage/${heritageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Favorites', id: 'LIST' }]
    }),

  })
})

export const {
  useGetFavoritesByUserIdQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation
} = favoriteApi
