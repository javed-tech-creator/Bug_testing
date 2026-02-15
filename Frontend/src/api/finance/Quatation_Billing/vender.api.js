import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const vendorApi = createApi({
  reducerPath: "vendorApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/vender" }),
  tagTypes: ["Vendor"],
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: () => ({ url: "/get", method: "GET" }),
      providesTags: ["Vendor"],
    }),
    getVendorById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
    }),
    createVendor: builder.mutation({
      query: (data) => ({ url: "/post", method: "POST", data }),
      invalidatesTags: ["Vendor"],
    }),
updateVendor: builder.mutation({
  query: ({ id, ...data }) => ({
    url: `/${id}`, // full path
    method: "PUT",
    data,
  }),
  invalidatesTags: ["Vendor"],
}),
    deleteVendor: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Vendor"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorByIdQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;
