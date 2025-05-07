import { apiSlice } from './apiSlice'
import { BASE_URL } from '~/constants/fe.constant'

export const knowledgeTestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKnowledgeTests: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = 'ALL' }) => ({
        url: `${BASE_URL}/knowledge-tests`,
        method: 'GET',
        params: {
          page,
          limit,
          ...(search && { title: search }),
          ...(status !== 'ALL' && { status }),
        },
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

    createKnowledgeTest: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/knowledge-tests`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['KnowledgeTests'],
    }),

    updateKnowledgeTest: builder.mutation({
      query: ({ testId, data }) => ({
        url: `${BASE_URL}/knowledge-tests/${testId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { testId }) => [
        { type: 'KnowledgeTests', id: testId },
        'KnowledgeTests',
      ],
    }),

    deleteKnowledgeTest: builder.mutation({
      query: (testId) => ({
        url: `${BASE_URL}/knowledge-tests/${testId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KnowledgeTests'],
    }),

    uploadKnowledgeTestImg: builder.mutation({
      query: (formData) => ({
        url: `${BASE_URL}/knowledge-tests/upload`,
        method: 'POST',
        body: formData,
      }),
    }),

    submitKnowledgeTestAttempt: builder.mutation({
      query: ({ userId, userName, testId, answers }) => ({
        url: `${BASE_URL}/knowledge-tests/${testId}/attempt`,
        method: 'POST',
        body: { userId, userName, answers },
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
  useCreateKnowledgeTestMutation,
  useUpdateKnowledgeTestMutation,
  useDeleteKnowledgeTestMutation,
  useUploadKnowledgeTestImgMutation,
  useSubmitKnowledgeTestAttemptMutation,
} = knowledgeTestApi