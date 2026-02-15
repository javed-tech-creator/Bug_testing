// redux/services/categoryApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const productCategoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Category"],

  endpoints: (builder) => ({

    getCategories: builder.query({
      query: () => ({ 
        url: "/vendor/get-categories",
         method: "GET"
         }),
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/vendor/add-category",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Category"],
    }),

    // ✅ Update Category
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/vendor/update-category/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Category"],
    }),

  }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, } = productCategoryApi;
