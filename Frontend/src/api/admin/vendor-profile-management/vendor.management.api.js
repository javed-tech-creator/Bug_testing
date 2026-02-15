import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const VendorProfileManagementApi = createApi({
  reducerPath: "VendorProfileManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["VendorProfileManagement"],

  endpoints: (builder) => ({
    //  GET All Vendors
    getAllVendors: builder.query({
      query: ({ page, limit, isActive } = {}) => ({
        url: `admin/vendor?page=${page}&limit=${limit}&isActive=${isActive}`,
        method: "GET",
      }),
      providesTags: ["VendorProfileManagement"],
    }),

    //  GET Vendor By ID (Lazy supported)
    getVendorById: builder.query({
      query: (id) => ({
        url: `admin/vendor/${id}`,
        method: "GET",
      }),
      providesTags: ["VendorProfileManagement"],
    }),

    //  CREATE Vendor (with file upload)
    createVendor: builder.mutation({
      query: (data) => ({
        url: "admin/vendor",
        method: "POST",
        data:data,

      }),
      invalidatesTags: ["VendorProfileManagement"],
    }),

    //  UPDATE Vendor (with file upload)
    updateVendor: builder.mutation({
      query: ({ id, data }) => ({
        url: `admin/vendor/${id}`,
        method: "PUT",
        data:data,
      }),
      invalidatesTags: ["VendorProfileManagement"],
    }),

  }),
});

export const {
  useCreateVendorMutation,
  useGetAllVendorsQuery,
  useLazyGetAllVendorsQuery,
  useLazyGetVendorByIdQuery,
  useUpdateVendorMutation,
} = VendorProfileManagementApi;
