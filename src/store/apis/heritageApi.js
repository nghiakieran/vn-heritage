import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockData } from '~/api/mock-data'

export const heritageApi = createApi({
  reducerPath: 'heritageApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getHeritages: builder.query({
      // Fake api backend
      queryFn: async ({ page, limit, search }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        let data = mockData.heritages

        if (search) {
          const query = search.toLowerCase()
          data = data.filter((item) => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.period.toLowerCase().includes(query)
          )
        }

        const startIndex = (page - 1) * limit
        const paginatedData = data.slice(startIndex, startIndex + limit)
        return {
          data: {
            data: paginatedData,
            total: data.length
          }
        }
      }
    })
  })
})

export const { useLazyGetHeritagesQuery } = heritageApi
