import { BASE_URL } from '~/constants/fe.constant';
import { apiSlice } from './apiSlice';

export const commentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all comments (with pagination, search, and filtering by heritageId)
    getAll: builder.query({
      query: ({ page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc', heritageId }) => ({
        url: `${BASE_URL}/comments/`,
        method: 'GET',
        params: { page, limit, search, sort, order, heritageId },
      }),
      providesTags: ['Comments'],
    }),

    // Get a comment by ID
    getCommentById: builder.query({
      query: (id) => ({
        url: `${BASE_URL}/comments/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Comments', id }],
    }),

    // Create a new comment
    createNew: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/comments/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Comments'],
    }),

    // Update a comment by ID
    updateComment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BASE_URL}/comments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Comments', id }, 'Comments'],
    }),

    // Delete a comment by ID
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),

    // Like or unlike a comment by ID
    likeComment: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/comments/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Comments', id }, 'Comments'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllQuery,
  useGetCommentByIdQuery,
  useCreateNewMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = commentSlice;