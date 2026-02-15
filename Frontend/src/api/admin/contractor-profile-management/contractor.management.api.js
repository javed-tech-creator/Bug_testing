import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const ContractorProfileManagementApi = createApi({
  reducerPath: "ContractorProfileManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ContractorProfileManagement"],

  endpoints: (builder) => ({
    //  GET All Contractors
    getAllContractors: builder.query({
      query: ({ page, limit, isActive } = {}) => ({
        url: `admin/contractor?page=${page}&limit=${limit}&isActive=${isActive}`,
        method: "GET",
      }),
      providesTags: ["ContractorProfileManagement"],
    }),

    //  GET Contractor By ID (Lazy supported)
    getContractorById: builder.query({
      query: (id) => ({
        url: `admin/contractor/${id}`,
        method: "GET",
      }),
      providesTags: ["ContractorProfileManagement"],
    }),

    //  CREATE Contractor (with file upload)
    createContractor: builder.mutation({
      query: (data) => ({
        url: "admin/contractor",
        method: "POST",
        data:data,

      }),
      invalidatesTags: ["ContractorProfileManagement"],
    }),

    //  UPDATE Contractor (with file upload)
    updateContractor: builder.mutation({
      query: ({ id, data }) => ({
        url: `admin/contractor/${id}`,
        method: "PUT",
        data:data,
      }),
      invalidatesTags: ["ContractorProfileManagement"],
    }),

  }),
});

export const {
  useCreateContractorMutation,
  useGetAllContractorsQuery,
  useLazyGetAllContractorsQuery,
  useLazyGetContractorByIdQuery,
  useUpdateContractorMutation,
} = ContractorProfileManagementApi;
