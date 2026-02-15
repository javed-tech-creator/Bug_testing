import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const budgetApis = createApi({
  reducerPath: "budgetApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/budgets" }),
  tagTypes: ["B1"],
  endpoints: (builder) => ({
    getBudgets: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["B1"],
    }),
    createBudget: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        data,
      }),
      invalidatesTags: ["B1"],
    }),
    updateBudget: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["B1"],
    }),
    deleteBudget: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["B1"],
    }),
  }),
});

export const {
  useGetBudgetsQuery,
  useCreateBudgetMutation,
  useUpdateBudgetMutation,
  useDeleteBudgetMutation,
} = budgetApis;
