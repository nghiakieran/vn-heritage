import { BASE_URL } from '~/constants/fe.constant'
import { apiSlice } from './apiSlice'

export const heritageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeritages: builder.query({
      query: ({ page = 1, limit = 9, name = '', status = 'ALL', sort = 'name', order = 'asc' }) => {
        const params = new URLSearchParams()
        params.append('page', page.toString())
        params.append('limit', limit.toString())
        if (name) params.append('name', name)
        if (status !== 'ALL') params.append('status', status)
        if (sort) params.append('sort', sort)
        if (order) params.append('order', order)
        return `${BASE_URL}/heritages?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [
            ...result.heritages.map(({ _id }) => ({ type: 'Heritages', id: _id })),
            { type: 'Heritages', id: 'LIST' },
          ]
          : [{ type: 'Heritages', id: 'LIST' }],
    }),


    getHeritagesById: builder.query({
      query: (id) => ({
        url: `${BASE_URL}/heritages/id/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Heritages', id }],
    }),

    getAllHeritageNames: builder.query({
      query: () => ({
        url: `${BASE_URL}/heritages/all-name`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Heritages', id }],
    }),

    getHeritagesBySlug: builder.query({
      query: (nameSlug) => `${BASE_URL}/heritages/${nameSlug}`,
      providesTags: (result, error, id) => [{ type: 'Heritages', id }],
    }),

    getNearestHeritages: builder.query({
      query: ({ latitude, longitude, limit }) =>
        `${BASE_URL}/heritages/explore?latitude=${latitude}&longitude=${longitude}&limit=${limit}`,
      providesTags: (result, error, id) => [{ type: 'Heritages', id }],
    }),

    createHeritage: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/heritages`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Heritages'],
    }),

    updateHeritage: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/heritages/id/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Heritages', id: arg.id }],
    }),

    deleteHeritage: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/heritages/id${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Heritages'],
    }),

     uploadHeritageImg: builder.mutation({
          query: (data) => ({
            url: `${BASE_URL}/heritages/upload`,
            method: 'POST',
            body: data,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Heritages', id }],
        }),
  }),
})

export const {
  useGetHeritagesQuery,
  useLazyGetHeritagesQuery,
  useGetHeritagesByIdQuery,
  useGetHeritagesBySlugQuery,
  useLazyGetNearestHeritagesQuery,
  useCreateHeritageMutation,
  useUpdateHeritageMutation,
  useDeleteHeritageMutation,
  useUploadHeritageImgMutation,
  useGetAllHeritageNamesQuery
} = heritageSlice

