// src/redux/taxPaymentApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const taxPaymentApi = createApi({
  reducerPath: "taxPaymentApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/account/taxpayment" }),
  tagTypes: ["TaxPayment"],
  endpoints: (builder) => ({
    // ✅ Get all payments
    getPayments: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["TaxPayment"],
    }),

    // ✅ Add new payment
    addPayment: builder.mutation({
      query: (payment) => ({ url: "/", method: "POST", data: payment }),
      invalidatesTags: ["TaxPayment"],
    }),

    // ✅ Update payment
    updatePayment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["TaxPayment"],
    }),
    uploadPaymentProof: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("paymentProof", file);
        return {
          url: `/${id}`,
          method: "PUT",
          data: formData,
          // ✅ Important: headers me Content-Type mat set karo
          // Browser automatically multipart/form-data set karega
        };
      },
      invalidatesTags: ["TaxPayment"],
    }),

    // ✅ Approve payment
    approvePayment: builder.mutation({
      query: (id) => ({
        url: `/approve/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["TaxPayment"],
    }),

    // ✅ Delete payment
    deletePayment: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["TaxPayment"],
    }),

    // ✅ Export (Different baseUrl for taxdeduct)
    exportPayments: builder.query({
      query: () => ({
        url: "/api/v1/account/taxdeduct/export/get",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
  useUploadPaymentProofMutation,
  useApprovePaymentMutation,
  useDeletePaymentMutation,
  useExportPaymentsQuery,
} = taxPaymentApi;
