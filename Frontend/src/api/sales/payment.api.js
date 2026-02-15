import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const paymentApi = createApi({
  reducerPath: "clientPayment",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["clientPayment"],
  endpoints: (builder) => ({
    InitialPayment: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/client-payment`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["clientPayment"],
    }),
    getClientPaymentByProjectId:builder.query({
      query:({projectId})=>({
        url:`/sales/client-payment?projectId=${projectId}`,
        method:"GET",
      })
    }),
    addPayment: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/payment`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["clientPayment"],
    }),
  }),
});

export const {
  useInitialPaymentMutation,
  useGetClientPaymentByProjectIdQuery,
  useAddPaymentMutation,
} = paymentApi;
