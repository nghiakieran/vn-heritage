import { apiSlice } from "./apiSlice"
import { BASE_URL } from "~/constants/fe.constant"

export const discussSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDiscussByParentId: builder.query({
      query: ({ heritageId, parentId }) => {
        const params = new URLSearchParams()
        params.append("heritageId", heritageId)
        if (parentId) {
          params.append("parentId", parentId)
        } else {
          params.append("parentId", "null")
        }
        return `${BASE_URL}/discuss?${params.toString()}`
      },
      transformResponse: (response) => {
        console.log("Raw API response:", response)
        return {
          discussArray: Array.isArray(response) ? response.map(discuss => ({
            ...discuss,
            username: discuss.user?.displayname || "Anonymous"
          })) : []
        }
      },
      providesTags: (result, error, arg) => {
        if (result?.discuss) {
          return [
            ...result.discuss.map((comment) => ({ type: "Discuss", id: comment._id })),
            { type: "Discuss" },
            ...(arg.parentId ? [{ type: "Discuss" }] : []),
            { type: "Discuss", id: "LIST" }
          ]
        }
        return [
          { type: "Discuss", id: `PRODUCT-${arg.heritageId}` },
          ...(arg.parentId ? [{ type: "Discuss", id: `PARENT-${arg.parentId}` }] : []),
          { type: "Discuss", id: "LIST" }
        ]
      }
    }),

    createDiscuss: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/discuss`,
        method: "POST",
        body: data
      }),
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "Discuss", id: `HERITAGE-${arg.heritageId}` },
          { type: "Discuss", id: "LIST" }
        ]
        if (arg.parentId) {
          tags.push({ type: "Discuss", id: `PARENT-${arg.parentId}` })
        }
        return tags
      }
    }),


    deleteDiscuss: builder.mutation({
      query: ({ heritageId, commentId }) => ({
        url: `${BASE_URL}/discuss?heritageId=${heritageId}&commentId=${commentId}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Discuss", id: arg.commentId },
        { type: "Discuss", id: `HERITAGE-${arg.heritageId}` },
        { type: "Discuss", id: "LIST" },
        ...(arg.parentId ? [{ type: "Discuss", id: `PARENT-${arg.parentId}` }] : [])
      ]
    })
  })
})

export const {
  useGetDiscussByParentIdQuery,
  useLazyGetDiscussByParentIdQuery,
  useCreateDiscussMutation,
  useDeleteDiscussMutation
} = discussSlice