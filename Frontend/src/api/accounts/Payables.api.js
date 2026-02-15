import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const vendorPaymentApi = createApi({
  reducerPath: "vendorPaymentApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/account/vendorpayment" }),
  tagTypes: ["VendorPayment"],

  endpoints: (builder) => ({
    // GET all vendor payments
    getVendorPayments: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["VendorPayment"],
    }),

    // GET single payment by ID
    getVendorPaymentById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["VendorPayment"],
    }),

    // CREATE payment
    createVendorPayment: builder.mutation({
      query: (newPayment) => ({
        url: "/",
        method: "POST",
        data: newPayment,
      }),
      invalidatesTags: ["VendorPayment"],
    }),

    // UPDATE payment
    updateVendorPayment: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/${id}`,
        method: "PUT",
        data: updateData,
      }),
      invalidatesTags: ["VendorPayment"],
    }),

    // DELETE payment
    deleteVendorPayment: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VendorPayment"],
    }),
  }),
});

export const {
  useGetVendorPaymentsQuery,
  useGetVendorPaymentByIdQuery,
  useCreateVendorPaymentMutation,
  useUpdateVendorPaymentMutation,
  useDeleteVendorPaymentMutation,
} = vendorPaymentApi;
