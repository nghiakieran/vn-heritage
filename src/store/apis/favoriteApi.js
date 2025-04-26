import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '~/constants/fe.constant'

export const favoriteApi = createApi({
  reducerPath: 'favoriteApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Favorite', 'UserFavorites'],
  endpoints: (builder) => ({
    getAllFavorites: builder.query({
      query: ({ page = 1, limit = 9 }) => {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        return `/favorites?${params.toString()}`
      },
      providesTags: ['Favorite'],
    }),

    getFavoritesByUserId: builder.query({
      query: ({ userId, page = 1, limit = 9 }) => {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        return `/favorites/user/${userId}?${params.toString()}`
      },
      providesTags: (result, error, { userId }) => [
        { type: 'UserFavorites', id: userId },
      ],
    }),

    getFavoriteById: builder.query({
      query: (id) => `/favorites/${id}`,
      providesTags: (result, error, id) => [{ type: 'Favorite', id }],
    }),

    updateFavorite: builder.mutation({
      query: ({ id, data }) => ({
        url: `/favorites/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Favorite', id },
      ],
    }),

    addToFavorites: builder.mutation({
      query: ({ userId, heritageId }) => ({
        url: '/favorites/add-to-favorites',
        method: 'POST',
        body: { userId, heritageId },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserFavorites', id: userId },
      ],
    }),

    removeFavorite: builder.mutation({
      query: ({ userId, heritageId }) => ({
        url: `/favorites/user/${userId}/heritage/${heritageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserFavorites', id: userId },
      ],
    }),
  }),
})

export const {
  useGetAllFavoritesQuery,
  useGetFavoritesByUserIdQuery,
  useGetFavoriteByIdQuery,
  useUpdateFavoriteMutation,
  useAddToFavoritesMutation,
  useRemoveFavoriteMutation,
} = favoriteApi
