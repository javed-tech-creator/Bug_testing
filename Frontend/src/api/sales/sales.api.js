import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["sales","recceStatus"],
  endpoints: (builder) => ({
    getProject: builder.query({
      query: () => ({
        url: "/sales/client-briefing/get/sales/form",
        method: "GET",
      }),
    }),
    getProjectById: builder.query({
      query: ({ id }) => ({
        url: `/sales/client-briefing/get/project/${id}`,
        method: "GET",
      }),
    }),
    getProjectByUserId: builder.query({
      query: ({ id }) => ({
        url: `/sales/client-briefing/get/our/project/${id}`,
        method: "GET",
      }),
    }),

    addRemainingPayment: builder.mutation({
      query: ({formData}) => ({
        url: `/project/payment/update`,
        method: "PUT",
        data: formData,
      }),
    }),

    getRecceStatus: builder.query({
      query: ({ id }) => ({
        url: `/recce/get/single/status/${id}`,
        method: "GET",
      }),
      providesTags: ["recceStatus"],
    }),

    submitToRecce: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/sales/client-briefing/send/to-recce/${id}`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["recceStatus"],
    }),
  }),
});

export const {
  useGetProjectQuery,
  useGetProjectByIdQuery,
  useAddInitialPaymentMutation,
  useSubmitToRecceMutation,
  useGetPaymentDetailQuery,
  useAddRemainingPaymentMutation,
  useGetProjectByUserIdQuery,
  useGetRecceStatusQuery
} = salesApi;
