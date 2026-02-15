import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: axiosBaseQuery({ baseUrl: "payment" }),  
  tagTypes: ["Payments", "VendorLedger"],
  endpoints: (builder) => ({
    // ✅ Payments CRUD
    getPayments: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["Payments"],
    }),
    getPaymentById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Payments"],
    }),
    createPayment: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", data }),
      invalidatesTags: ["Payments", "VendorLedger"],
    }),
    updatePayment: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/${id}`, method: "PUT", data }),
      invalidatesTags: ["Payments", "VendorLedger"],
    }),
    deletePayment: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Payments", "VendorLedger"],
    }),
    updatePaymentStage: builder.mutation({
      query: ({ id, stage }) => ({ url: `/${id}/stage`, method: "PATCH", data: { stage } }),
      invalidatesTags: ["Payments", "VendorLedger"],
    }),

    // ✅ Vendor Ledger
    getVendorLedger: builder.query({
      query: (vendorId) => ({ url: `ledger/${vendorId}`, method: "GET" }),
      providesTags: ["VendorLedger"],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useUpdatePaymentStageMutation,
  useGetVendorLedgerQuery,
} = paymentsApi;
