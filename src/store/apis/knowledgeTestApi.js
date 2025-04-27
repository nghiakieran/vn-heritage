import { apiSlice } from './apiSlice'
import { BASE_URL } from '~/constants/fe.constant'

export const knowledgeTestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKnowledgeTests: builder.query({
      query: () => ({
        url: `${BASE_URL}/knowledge-tests`,
        method: 'GET',
      }),
      providesTags: ['KnowledgeTests'],
      keepUnusedDataFor: 1,
    }),

    getKnowledgeTestById: builder.query({
      query: (testId) => ({
        url: `${BASE_URL}/knowledge-tests/${testId}`,
        method: 'GET',
      }),
      providesTags: (result, error, testId) => [{ type: 'KnowledgeTests', id: testId }],
      keepUnusedDataFor: 1,
    }),

    submitKnowledgeTestAttempt: builder.mutation({
      query: ({ testId, answers }) => ({
        url: `${BASE_URL}/knowledge-tests/${testId}/attempt`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: (result, error, { testId }) => [
        { type: 'KnowledgeTests', id: testId },
        { type: 'Leaderboards' },
      ],
    }),
  }),
})

export const {
  useGetKnowledgeTestsQuery,
  useGetKnowledgeTestByIdQuery,
  useLazyGetKnowledgeTestByIdQuery,
  useSubmitKnowledgeTestAttemptMutation,
} = knowledgeTestApi