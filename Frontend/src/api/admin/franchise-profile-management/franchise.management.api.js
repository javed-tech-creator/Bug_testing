import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const FranchiseProfileManagementApi = createApi({
  reducerPath: "FranchiseProfileManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["FranchiseProfileManagement"],

  endpoints: (builder) => ({
    //  GET All Franchises
    getAllFranchises: builder.query({
      query: ({ page, limit, isActive } = {}) => ({
        url: `admin/franchise?page=${page}&limit=${limit}&isActive=${isActive}`,
        method: "GET",
      }),
      providesTags: ["FranchiseProfileManagement"],
    }),

    //  GET Franchise By ID (Lazy supported)
    getFranchiseById: builder.query({
      query: (id) => ({
        url: `admin/franchise/${id}`,
        method: "GET",
      }),
      providesTags: ["FranchiseProfileManagement"],
    }),

    //  CREATE Franchise (with file upload)
    createFranchise: builder.mutation({
      query: (data) => ({
        url: "admin/franchise",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["FranchiseProfileManagement"],
    }),

    //  UPDATE Franchise (with file upload)
    updateFranchise: builder.mutation({
      query: ({ id, data }) => ({
        url: `admin/franchise/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["FranchiseProfileManagement"],
    }),
  }),
});

export const {
  useCreateFranchiseMutation,
  useGetAllFranchisesQuery,
  useLazyGetAllFranchisesQuery,
  useLazyGetFranchiseByIdQuery,
  useUpdateFranchiseMutation,
} = FranchiseProfileManagementApi;
