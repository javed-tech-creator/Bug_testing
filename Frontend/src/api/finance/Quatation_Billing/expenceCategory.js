import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/category" }), // ✅ tumhara backend endpoint
  tagTypes: ["C1"],
  endpoints: (builder) => ({
    // --- Get all categories ---
    getCategories: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["C1"], // ✅ cache invalidation tag
    }),

    // --- Create category ---
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["C1"], // ✅ triggers refetch of getCategories
    }),

    // --- Update category ---
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["C1"], // ✅ triggers refetch
    }),

    // --- Delete category ---
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["C1"], // ✅ triggers refetch
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
