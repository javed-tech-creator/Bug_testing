
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const ledgerApi = createApi({
  reducerPath: "ledgerApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/ledger" }),
  tagTypes: ["Ledger"],
  endpoints: (builder) => ({
    // CRUD
    getLedgers: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["Ledger"],
    }),
    createLedger: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", data }),
      invalidatesTags: ["Ledger"],
    }),

    getClientLedger: builder.query({
      query: (clientId) => ({ url: `/ledger/clients/${clientId}`, method: "GET" }),
    }),

    getVendorLedger: builder.query({
      query: (vendorId) => ({ url: `/ledger/vendors/${vendorId}`, method: "GET" }),
    }),

    getExpenseReports: builder.query({
      query: ({ category, startDate, endDate }) => ({
        url: `/expenses?category=${category || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}`,
        method: "GET",
      }),
    }),

    getOutstanding: builder.query({
      query: () => ({ url: "/outstanding", method: "GET" }),
    }),

    exportExcel: builder.query({
      query: () => ({ url: "/export/excel", method: "GET" }),
    }),

    exportPDF: builder.query({
      query: () => ({ url: "/export/pdf", method: "GET" }),
    }),

    getDashboard: builder.query({
      query: () => ({ url: "/dashboard", method: "GET" }),
    }),
    getClients: builder.query({
      query: () => ({ url: "/ledger/clients", method: "GET" })
    }),

    getVendors: builder.query({
      query: () => ({ url: "/ledger/vendors", method: "GET" })
    }),

    getLedger: builder.query({
      query: () => ({ url: "/", method: "GET" })
    }),
    updateLedger: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: "PUT", data }),
      invalidatesTags: ["Ledger"],
    }),
    deleteLedger: builder.mutation({
      query: (id) => ({ url: `/del/${id}`, method: "DELETE" }),
      invalidatesTags: ["Ledger"],
    }),
  }),


});

export const {
    useUpdateLedgerMutation,
  useDeleteLedgerMutation,
  useGetLedgerQuery,
  useGetLedgersQuery,
  useGetClientsQuery, useGetVendorsQuery,
  useCreateLedgerMutation,
  useGetClientLedgerQuery,
  useGetVendorLedgerQuery,
  useGetExpenseReportsQuery,
  useGetOutstandingQuery,
  useExportExcelQuery,
  useExportPDFQuery,
  useGetDashboardQuery,
} = ledgerApi;

