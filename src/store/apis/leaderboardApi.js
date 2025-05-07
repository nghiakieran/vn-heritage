import { apiSlice } from "./apiSlice"

export const leaderboardSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboardByHeritageId: builder.query({
      query: ({ heritageId, page = 1, limit = 9 }) => {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        return `/leaderBoards/heritage/${heritageId}?${params.toString()}`
      },
      providesTags: (_, __, { heritageId }) => [{ type: 'Leaderboards', id: heritageId }],
    }),

    getLeaderboardById: builder.query({
      query: (leaderboardId) => `/leaderBoards/${leaderboardId}`,
      providesTags: (_, __, id) => [{ type: 'Leaderboards', id }],
    }),
  }),
})

export const {
  useGetLeaderboardByHeritageIdQuery,
  useLazyGetLeaderboardByHeritageIdQuery,
  useGetLeaderboardByIdQuery,
  useLazyGetLeaderboardByIdQuery,
} = leaderboardSlice
