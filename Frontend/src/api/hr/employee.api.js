import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const employeeApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: "employee",
  tagTypes: ["employee", "training"],
  endpoints: (builder) => ({
    createEmployee: builder.mutation({
      query: ({ formData }) => ({
        url: "/hr/employee-profile",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["employee"],
    }),
    emplyeeUpdateMutation: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/employee-profile/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["employee"],
    }),
    getEmployeeById: builder.query({
      query: ({ id }) => ({
        url: `/hr/employee-profile/${id}`,
        method: "GET",
      }),
      providesTags: ["employee"],
    }),
    getAllEmployee: builder.query({
      query: () => ({
        url: `/hr/employee-profile`,
        method: "GET",
      }),
      providesTags: ["employee"],
    }),
    updateDocument: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/employee-profile/${id}/documents`,
        method: "PUT",
        data: formData,
      }),
    }),
    updateEmployeeRating: builder.mutation({
      query: ({ id, rating, review }) => ({
        url: `/hr/employee-profile/${id}/rating`,
        method: "PUT",
        data: { rating, review },
      }),
      invalidatesTags: ["employee"],
    }),
    getHiredCandidate: builder.query({
      query: () => ({
        url: "/hr/candidate/hired",
        method: "GET",
      }),
      invalidatesTags: ["employee"],
    }),
    getEmployeeGrowth: builder.query({
      query: () => ({
        url: "/hr/employee-profile/growth",
        method: "GET",
      }),
      providesTags: ["employee"],
    }),
    // traing apis
    createTraining: builder.mutation({
      query: ({ formData }) => ({
        url: "/hr/training",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["training"],
    }),
    updateTraining: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/hr/training/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["training"],
    }),
    getTrainingByEmployee: builder.query({
      query: ({ id }) => ({
        url: `/hr/training/employee/${id}`,
        method: "GET",
      }),
    }),

    createUser: builder.mutation({
      query: ({ formData }) => ({
        url: `/hr/`,
        method: "POST",
        data: formData,
      }),
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetHiredCandidateQuery,
  useEmplyeeUpdateMutationMutation,
  useGetEmployeeByIdQuery,
  useUpdateDocumentMutation,
  useCreateUserMutation,
  useGetAllEmployeeQuery,
  useCreateTrainingMutation,
  useGetTrainingByEmployeeQuery,
  useUpdateTrainingMutation,
  useUpdateEmployeeRatingMutation,
  useGetEmployeeGrowthQuery,
} = employeeApi;
