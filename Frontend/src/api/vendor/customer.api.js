// src/redux/services/customerApi.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const vendorCustomerApi = createApi({
  reducerPath: "vendor-customer",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Customers"],

  endpoints: (builder) => ({

    // 1. Get All Customers
    getCustomers: builder.query({
      query: () => ({
        url: "/vendor/get-customers",
        method: "GET",
      }),
      providesTags: ["Customers"],
    }),

    // 2. Create/Add Customer
    createCustomer: builder.mutation({
      query: (payload) => ({
        url: "/vendor/create-customers",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Customers"], // Refresh customer list after adding
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useCreateCustomerMutation,
} = vendorCustomerApi;
