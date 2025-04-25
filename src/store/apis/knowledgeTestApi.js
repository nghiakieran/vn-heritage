import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '~/constants/fe.constant'

export const knowledgeTestApi = createApi({
  reducerPath: 'knowledgeTestApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['KnowledgeTests'],
  endpoints: (builder) => ({
    getKnowledgeTests: builder.query({
      query: () => '/knowledge-tests/',
      providesTags: ['KnowledgeTests'],
    }),

    getKnowledgeTestById: builder.query({
      query: (testId) => `/knowledge-tests/${testId}`,
      providesTags: (_, __, id) => [{ type: 'KnowledgeTests', id }],
    }),

    submitKnowledgeTestAttempt: builder.mutation({
      query: ({ testId, answers }) => ({
        url: `/knowledge-tests/${testId}/attempt`,
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: (_, __, { testId }) => [{ type: 'KnowledgeTests', id: testId }, { type: 'Leaderboards' }],
    }),
  }),
})

export const { useGetKnowledgeTestsQuery, useGetKnowledgeTestByIdQuery, useLazyGetKnowledgeTestByIdQuery, useSubmitKnowledgeTestAttemptMutation } =
  knowledgeTestApi
