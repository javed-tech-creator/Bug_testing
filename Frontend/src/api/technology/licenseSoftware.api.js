import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const licenseSoftwareApi = createApi({
  reducerPath: "licenseSoftwareApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["License"],

  endpoints: (builder) => ({
 
 //  Add License
    addLicense: builder.mutation({
      query: (data) => ({
        url: "/tech/license-software/add",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["License","DashboardSummary"],
    }),

    //  Get All Licenses
    getLicenses: builder.query({
      query: ({ page, limit }) => ({
        url: `/tech/license-software/get?page=${page}&limit=${limit}`,
      }),
      providesTags: ["License"],
    }),

    //  Update License
    updateLicense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/license-software/update/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["License","DashboardSummary"],
    }),

    //  Assign License
    assignLicense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/license-software/assign/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["License"],
    }),

    //  Delete License
    deleteLicense: builder.mutation({
      query: (id) => ({
        url: `/tech/license-software/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["License","DashboardSummary"],
    }),


  }),
});

export const {
useAddLicenseMutation,
  useGetLicensesQuery,
  useUpdateLicenseMutation,
  useAssignLicenseMutation,
  useDeleteLicenseMutation,
} = licenseSoftwareApi;
