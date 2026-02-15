import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const SalesDashboardApi = createApi({
  reducerPath: "salesDashboardApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["salesDashboardApi"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `sales/dashboard/stats`,
        method: "GET",
      }),
    }),
    getExecutivePerformance: builder.query({
      query: ({ type }) => ({
        url: `sales/dashboard/executive-performance?type=${type}`,
        method: "GET",
      }),
    }),
    getMonthlyLeadPerformanceFY: builder.query({
      query: () => ({
        url: `sales/dashboard/monthly-lead-count`,
        method: "GET",
      }),
    }),
    getLeadAnalytics: builder.query({
      query: () => ({
        url: `sales/dashboard/lead-analytics`,
        method: "GET",
      }),
    }),
    getLeadSourceMonthlyFY: builder.query({
      query: ({ type }) => ({
        url: `sales/dashboard/lead-sources?type=${type}`,
        method: "GET",
      }),
    }),
    getLostLeadExpectedAmount: builder.query({
      query: ({ period, label }) => ({
        url: `sales/dashboard/lost-lead-amount?period=${period}&label=${label}`,
        method: "GET",
      }),
    }),
    getPendingClientPayments: builder.query({
      query: ({ status }) => ({
        url: `sales/dashboard/pending-client-payment?status=${status}`,
        method: "GET",
      }),
    }),
    getTotalRevenue: builder.query({
      query: ({ period, view }) => ({
        url: `sales/dashboard/get-total-revenue?period=${period}&view=${view}`,
        method: "GET",
      }),
    }),
    getChartRevenue: builder.query({
      query: ({ self, month }) => ({
        url: `sales/dashboard/get-chart-revenue?scope=${self}&period=${month}`,
        method: "GET",
      }),
    }),
    getClientsChart: builder.query({
      query: ({ view = "self", period = "week" }) => ({
        url: "/sales/dashboard/clients-chart",
        params: { view, period },
      }),
    }),
    getPaymentStatusChart: builder.query({
      query: ({ period = "month", scope = "self", startDate, endDate }) => {
        let query = `?period=${period}&scope=${scope}`;
        if (period === "custom" && startDate && endDate) {
          query += `&startDate=${startDate}&endDate=${endDate}`;
        }
        return {
          url: `sales/dashboard/get-payment-status${query}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetExecutivePerformanceQuery,
  useGetMonthlyLeadPerformanceFYQuery,
  useGetLeadAnalyticsQuery,
  useGetLeadSourceMonthlyFYQuery,
  useGetLostLeadExpectedAmountQuery,
  useGetPendingClientPaymentsQuery,
  useGetTotalRevenueQuery,
  useGetChartRevenueQuery,
  useGetClientsChartQuery,
  useGetPaymentStatusChartQuery,
} = SalesDashboardApi;
