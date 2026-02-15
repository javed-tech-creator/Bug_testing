import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const FreelancerProfileManagementApi = createApi({
  reducerPath: "FreelancerProfileManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["FreelancerProfileManagement"],

  endpoints: (builder) => ({
    //  GET All Freelancers
    getAllFreelancers: builder.query({
      query: ({ page, limit, isActive } = {}) => ({
        url: `admin/freelancer?page=${page}&limit=${limit}&isActive=${isActive}`,
        method: "GET",
      }),
      providesTags: ["FreelancerProfileManagement"],
    }),

    //  GET Freelancer By ID (Lazy supported)
    getFreelancerById: builder.query({
      query: (id) => ({
        url: `admin/freelancer/${id}`,
        method: "GET",
      }),
      providesTags: ["FreelancerProfileManagement"],
    }),

    //  CREATE Freelancer (with file upload)
    createFreelancer: builder.mutation({
      query: (data) => ({
        url: "admin/freelancer",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["FreelancerProfileManagement"],
    }),

    //  UPDATE Freelancer (with file upload)
    updateFreelancer: builder.mutation({
      query: ({ id, data }) => ({
        url: `admin/freelancer/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["FreelancerProfileManagement"],
    }),
  }),
});

export const {
  useCreateFreelancerMutation,
  useGetAllFreelancersQuery,
  useLazyGetAllFreelancersQuery,
  useLazyGetFreelancerByIdQuery,
  useUpdateFreelancerMutation,
} = FreelancerProfileManagementApi;
