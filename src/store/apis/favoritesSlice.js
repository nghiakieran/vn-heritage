import { BASE_URL } from '~/constants/fe.constant';
import { apiSlice } from './apiSlice';

export const favoriteSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavoritesByUserId: builder.query({
      query: ({ userId, page = 1, limit = 9 }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        return `${BASE_URL}/favorites/user/${userId}?${params.toString()}`;
      },
      transformResponse: (response) => {
        if (response && response.items) {
          const favoriteMap = response.items.reduce((map, item) => {
            map[item._id] = true;
            return map;
          }, {});
          return {
            ...response,
            favoriteMap,
          };
        }
        return response;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ _id }) => ({ type: 'Favorites', id: _id })),
            { type: 'Favorites', id: 'LIST' },
          ]
          : [{ type: 'Favorites', id: 'LIST' }],
    }),

    addToFavorites: builder.mutation({
      query: ({ userId, heritageId }) => ({
        url: `${BASE_URL}/favorites/add-to-favorites`,
        method: 'POST',
        body: { userId, heritageId },
      }),
      invalidatesTags: [{ type: 'Favorites', id: 'LIST' }],
    }),

    removeFromFavorites: builder.mutation({
      query: ({ userId, heritageId }) => ({
        url: `${BASE_URL}/favorites/user/${userId}/heritage/${heritageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Favorites', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetFavoritesByUserIdQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = favoriteSlice;
