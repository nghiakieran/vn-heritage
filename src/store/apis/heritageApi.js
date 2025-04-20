import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const heritageApi = createApi({
  reducerPath: 'heritageApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8017/v1/' }),
  tagTypes: ['Heritages'],
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

        return `heritages?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [
            ...result.heritages.map(({ _id }) => ({ type: 'Heritages', id: _id })),
            { type: 'Heritages', id: 'LIST' }
          ]
          : [{ type: 'Heritages', id: 'LIST' }]
    }),
    getHeritagesById: builder.query({
      query: (heritageId) => `heritages/${heritageId}`,
      providesTags: (id) => [{ type: 'Heritages', id }]
    })
  })
})

export const { useLazyGetHeritagesQuery, useGetHeritagesByIdQuery } = heritageApi
