// src/redux/vendorApis.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const vendorApis = createApi({
  reducerPath: "vendorApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/account/vendor" }),
  tagTypes: ["Ve"],
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: () => ({ url: "/", method: "GET" }),
      transformResponse: (response) => response.vendors || [], // only array
      providesTags: ["Ve"],
    }),
    getVendorById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Ve"],
    }),
    addVendor: builder.mutation({
      query: (vendor) => ({ url: "/", method: "POST", data: vendor }),
      invalidatesTags: ["Ve"],
    }),
    updateVendor: builder.mutation({
      query: ({ id, ...vendor }) => ({ url: `/${id}`, method: "PUT", data: vendor }),
      invalidatesTags: ["Ve"],
    }),
    deleteVendor: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Ve"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApis;
