import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const payoutApi = createApi({
  reducerPath: "payoutApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/payout" }), // Backend route prefix
  tagTypes: ["Payout"],
  endpoints: (builder) => ({
    // Get All Payouts
    getPayouts: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      providesTags: ["Payout"],
    }),

    // Get Payout by ID
    getPayoutById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
    }),

    // Create New Payout
    createPayout: builder.mutation({
      query: (data) => ({ url: "/", method: "POST", data }),
      invalidatesTags: ["Payout"],
    }),

    // Update Payout Status
    updatePayoutStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}/status`,  // backend me aapne status update ke liye banaya tha
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Payout"],
    }),

    // Delete Payout
    deletePayout: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Payout"],
    }),
  }),
});

export const {
  useGetPayoutsQuery,
  useGetPayoutByIdQuery,
  useCreatePayoutMutation,
  useUpdatePayoutStatusMutation,
  useDeletePayoutMutation,
} = payoutApi;
