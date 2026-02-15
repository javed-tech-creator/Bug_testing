// src/redux/slices/payrollApi.js
import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const payrollApi = createApi({
  reducerPath: "payroll",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Payroll"],
  endpoints: (builder) => ({ 
    getAllSalarySlips: builder.query({
      query: ({ year, month }) => ({
        url: `/hr/payroll/viewAll?year=${year}&month=${month}`,
        method: "GET",
    }),
    providesTags: ["Payroll"],
}),
    // Get single employee salary by month
    getEmployeeSalaryByMonth: builder.query({
      query: ({ id, year, month }) => ({
        url: `/hr/payroll/month/${id}?year=${year}&month=${month}`,
        method: "GET",
      }),
      providesTags: ["Payroll"],
    }),

    // Add manual salary slip
    addSalarySlip: builder.mutation({
      query: (data) => ({
        url: "/hr/payroll/add",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Payroll"],
    }),

    // Mark salary payment
    markSalaryPayment: builder.mutation({
      query: (data) => ({
        url: "/hr/payroll/pay",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Payroll"],
    }),

    // Approve salary
    approveSalary: builder.mutation({
      query: (data) => ({
        url: "/hr/payroll/approve",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Payroll"],
    }),

    // Reject salary
    rejectSalary: builder.mutation({
      query: (data) => ({
        url: "/hr/payroll/reject",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Payroll"],
    }),

    // Get payment summary
    getPaymentSummary: builder.query({
      query: ({ year, month }) => ({
        url: `/hr/payroll/summary?year=${year}&month=${month}`,
        method: "GET",
      }),
      providesTags: ["Payroll"],
    }),

    // Get payroll monthly chart data
    getPayrollChart: builder.query({
      query: (year) => ({
        url: `/hr/payroll/chart?year=${year}`,
        method: "GET",
      }),
      providesTags: ["Payroll"],
    }),

    // Download salary slip PDF
    downloadSalarySlip: builder.query({
      query: ({ id, year, month }) => ({
        url: `/hr/payroll/download/${id}?year=${year}&month=${month}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetAllSalarySlipsQuery,
  useGetEmployeeSalaryByMonthQuery,
  useAddSalarySlipMutation,
  useMarkSalaryPaymentMutation,
  useApproveSalaryMutation,
  useRejectSalaryMutation,
  useGetPaymentSummaryQuery,
  useGetPayrollChartQuery,
  useLazyDownloadSalarySlipQuery,
} = payrollApi;