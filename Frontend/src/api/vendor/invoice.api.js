// src/redux/services/invoiceApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

//tumhara existing axios wrapper

export const vendorInvoiceApi = createApi({
  reducerPath: "vendor-invoice",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Invoice","Drafts"],

  
  endpoints: (builder) => ({

    // 1. Next Invoice Number Preview
    getNextInvoiceNumber: builder.query({
      query: () => ({
        url: "/vendor/next-invoice",
        method: "GET",
      }),
    }),

    // ✅ 2. Get invoices (with query params)
    getInvoices: builder.query({
      query: ({ page = 1, limit = 10, status, startDate, endDate }) => {
        let query = `?page=${page}&limit=${limit}`;
        if (status) query += `&status=${status}`;
        if (startDate && endDate) query += `&startDate=${startDate}&endDate=${endDate}`;

        return {
          url: `/vendor/get-invoices${query}`,
          method: "GET",
        };
      },
      providesTags: ["Invoice"],
    }),

    // 3. Create Invoice
    createInvoice: builder.mutation({
      query: (payload) => ({
        url: "/vendor/create-invoices",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Invoice","Drafts"],
    }),

    // 4. update invoice payment
     updateInvoicePayment: builder.mutation({
      query: ({ invoiceId, payload }) => ({
        url: `/vendor/update-invoice-payment/${invoiceId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["Invoice"],
    }),

     // ✅ 5. Download Invoice PDF
    getInvoicePdf: builder.query({
      query: (invoiceId) => ({
        url: `/vendor/invoice-pdf/${invoiceId}`,
        method: "GET",
        responseType: "blob", // important for file download
      }),
    }),

  }),
});

export const {
  useGetNextInvoiceNumberQuery,
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoicePaymentMutation,
    useLazyGetInvoicePdfQuery, // lazy query for PDF

} = vendorInvoiceApi;
