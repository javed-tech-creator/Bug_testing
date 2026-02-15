import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const vendorDashboardApi = createApi({
  reducerPath: "vendor-dashboard",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["VendorDashboard"],

  endpoints: (builder) => ({
    // 🔹 Top Cards API
    getVendorTopCards: builder.query({
      query: () => ({
        url: "/vendor/dashboard-top/data",
        method: "GET",
      }),
      providesTags: ["VendorDashboard"],
    }),

    // 🔹 Latest Invoices API (with pagination)
    getLatestInvoices: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/vendor/dashboard-invoices/data?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["VendorDashboard"],
    }),

    // 🔹 Charts Data API
    getVendorChartsData: builder.query({
      query: () => ({
        url: "/vendor/dashboard-chart/data",
        method: "GET",
      }),
      providesTags: ["VendorDashboard"],
    }),
  }),
});

export const {
  useGetVendorTopCardsQuery,
  useGetLatestInvoicesQuery,
  useGetVendorChartsDataQuery,
} = vendorDashboardApi;
