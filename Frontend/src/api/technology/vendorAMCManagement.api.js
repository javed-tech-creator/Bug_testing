import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const vendorAMCManagementApi = createApi({
  reducerPath: "vendorAMCManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["VendorManagement"],

  endpoints: (builder) => ({

    
    //  Add Vendor
    addVendor: builder.mutation({
      query: (data) => ({
        url: "/tech/vendor-management/add",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["VendorManagement","DashboardSummary"],
    }),

    //  Get Vendors (with pagination)
    getVendors: builder.query({
      query: ({ page, limit }) => ({
        url: `/tech/vendor-management/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["VendorManagement"],
    }),

    //  Update Vendor
    updateVendor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/vendor-management/update/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["VendorManagement","DashboardSummary"],
    }),

    //  Delete Vendor
    deleteVendor: builder.mutation({
      query: (id) => ({
        url: `/tech/vendor-management/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["VendorManagement","DashboardSummary"],
    }),

  }),
});

export const {
useAddVendorMutation,
  useGetVendorsQuery,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorAMCManagementApi;
