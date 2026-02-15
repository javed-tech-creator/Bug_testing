import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const expenceApis = createApi({
  reducerPath: "expenseApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/expences" }),
  tagTypes: ["Expense"],
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["Expense"],
    }),
    createExpense: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["Expense"],
    }),
    updateExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Expense"],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),
updateStatus: builder.mutation({
  query: ({ id, status }) => ({
    url: `/${id}`,
    method: "PUT",
    data: { status }, // body → data
  }),
  invalidatesTags: ["Expense"],
}),
    // Budget vs Actual report
    budgetReport: builder.query({
      query: ({ project, department }) => ({
        url: "/report/budget-vs-actual",
        method: "GET",
        params: { project, department },
      }),
    }),
  }),
});

export const {
  useUpdateStatusMutation,
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useBudgetReportQuery,
} = expenceApis;
