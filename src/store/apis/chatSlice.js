/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:8000';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Chat'],
  endpoints: (builder) => ({
    getApiResponse: builder.mutation({
      query: ({ question, sessionId, model }) => ({
        url: '/chat',
        method: 'POST',
        body: { question, session_id: sessionId, model },
      }),
      invalidatesTags: (result, error, { sessionId }) =>
        sessionId ? [{ type: 'Chat', id: sessionId }] : [],
    }),
    getChatHistory: builder.query({
      query: (sessionId) => `/chat/history/${sessionId}`,
      transformResponse: (response) => (Array.isArray(response) ? response : []),
      providesTags: (result, error, sessionId) =>
        sessionId
          ? [{ type: 'Chat', id: sessionId }, { type: 'Chat', id: 'LIST' }]
          : [{ type: 'Chat', id: 'LIST' }],
    }),
    uploadDocument: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return {
          url: '/upload-file',
          method: 'POST',
          body: formData,
          headers: {}, // Remove Content-Type for FormData
        };
      },
      invalidatesTags: (result, error, file) => [{ type: 'Chat', id: 'LIST' }],
    }),
    uploadWebsite: builder.mutation({
      query: (payload) => {
        console.log('RTK Query sending payload:', payload); // Debug payload
        return {
          url: '/upload-website',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: (result, error, payload) => [{ type: 'Chat', id: 'LIST' }],
    }),

    uploadJson: builder.mutation({
      query: (data) => {
        return {
          url: '/upload-landmark-info',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: (result, error, file) => [{ type: 'Chat', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetApiResponseMutation,
  useGetChatHistoryQuery,
  useUploadDocumentMutation,
  useUploadWebsiteMutation,
  useUploadJsonMutation
} = chatApi;