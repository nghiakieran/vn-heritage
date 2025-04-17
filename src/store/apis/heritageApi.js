// frontend/src/features/heritages/heritageApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const heritageApi = createApi({
  reducerPath: "heritageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8017/v1/" }),
  tagTypes: ["Heritages"],
  endpoints: (builder) => ({
    getHeritages: builder.query({
      query: ({
        page = 1,
        limit = 9,
        name = "",
        status = "ALL",
        sort = "name",
        order = "asc",
      }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (name) params.append("name", name);
        if (status !== "ALL") params.append("status", status);
        if (sort) params.append("sort", sort);
        if (order) params.append("order", order);

        return `heritages?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.heritages.map(({ _id }) => ({
                type: "Heritages",
                id: _id,
              })),
              { type: "Heritages", id: "LIST" },
            ]
          : [{ type: "Heritages", id: "LIST" }],
    }),
    getHeritagesById: builder.query({
      query: (heritageId) => `heritages/${heritageId}`,
      providesTags: (id) => [{ type: "Heritages", id }],
    }),
    createHeritage: builder.mutation({
      query: (newHeritage) => ({
        url: "heritages",
        method: "POST",
        body: newHeritage,
      }),
      invalidatesTags: [{ type: "Heritages", id: "LIST" }],
    }),
    updateHeritage: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `heritages/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Heritages", id: arg.id },
      ],
    }),
    deleteHeritage: builder.mutation({
      query: (id) => ({
        url: `heritages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Heritages", id }],
    }),
  }),
});

export const {
  useLazyGetHeritagesQuery,
  useGetHeritagesByIdQuery,
  useCreateHeritageMutation,
  useUpdateHeritageMutation,
  useDeleteHeritageMutation,
} = heritageApi;
