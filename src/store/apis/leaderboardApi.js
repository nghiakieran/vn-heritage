import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '~/constants/fe.constant'

export const leaderboardApi = createApi({
  reducerPath: 'leaderboardApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Leaderboards'],
  endpoints: (builder) => ({
    getLeaderboardByHeritageId: builder.query({
      query: ({ heritageId, page = 1, limit = 9 }) => {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        return `/leaderBoards/heritage/${heritageId}?${params.toString()}`
      },
      providesTags: (_, __, { heritageId }) => [{ type: 'Leaderboards', id: heritageId }]
    }),

    getLeaderboardById: builder.query({
      query: (leaderboardId) => `/leaderBoards/${leaderboardId}`,
      providesTags: (_, __, id) => [{ type: 'Leaderboards', id }]
    }),
  })
})

export const {
  useGetLeaderboardByHeritageIdQuery,
  useLazyGetLeaderboardByHeritageIdQuery,
  useGetLeaderboardByIdQuery,
  useLazyGetLeaderboardByIdQuery,
} = leaderboardApi
