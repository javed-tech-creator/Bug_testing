import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const accountInvoiceApi = createApi({
  reducerPath: "accountInvoiceApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/account/inv" }),
  tagTypes: ["Invoice"],

  endpoints: (builder) => ({
    // GET all invoices
    getInvoices: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["Invoice"],
    }),

    // GET single invoice
    getInvoiceById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Invoice"],
    }),

    // CREATE invoice
    createInvoice: builder.mutation({
      query: (newInvoice) => ({ url: "/", method: "POST", data: newInvoice }),
      invalidatesTags: ["Invoice"],
    }),

    // UPDATE invoice
    updateInvoice: builder.mutation({
      query: ({ id, ...newInvoice }) => ({
        url: `/${id}`,
        method: "PUT",
        data: newInvoice,
      }),
      invalidatesTags: ["Invoice"],
    }),

    // DELETE invoice
    deleteInvoice: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Invoice"],
    }),

    // ADD note / payment
    addInvoiceNote: builder.mutation({
      query: ({ id, ...note }) => ({
        url: `/${id}/note`,
        method: "POST",
        data: note,
      }),
      invalidatesTags: ["Invoice"],
    }),

    // Generate PDF
    generateInvoicePDF: builder.mutation({
      query: (id) => ({ url: `/${id}/pdf`, method: "GET", responseType: "blob" }),
    }),
     getSummary: builder.query({
      query: () => ({ url: "/dashboardsummary", method: "GET" }),
      providesTags: ["Invoice"],
    }),
    sendPaymentReminders: builder.mutation({
  query: () => ({
    url: "/remainder",
    method: "POST",  // POST use kar rahe backend ke liye
  }),
}),
  }),
});

export const {
  useSendPaymentRemindersMutation,
  useGetSummaryQuery,
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useAddInvoiceNoteMutation,
  useGenerateInvoicePDFMutation,
} = accountInvoiceApi;
