import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const poApi = createApi({
  reducerPath: "poApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/purchase" }),
  tagTypes: ["PO"],
  endpoints: (builder) => ({
    getPOs: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["PO"],
    }),
    getPOById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
    }),
    createPO: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", data }),
      invalidatesTags: ["PO"],
    }),
    updatePO: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: "PUT", data }),
      invalidatesTags: ["PO"],
    }),
    deletePO: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["PO"],
    }),
  }),
});

export const {
  useGetPOsQuery,
  useGetPOByIdQuery,
  useCreatePOMutation,
  useUpdatePOMutation,
  useDeletePOMutation,
} = poApi;
