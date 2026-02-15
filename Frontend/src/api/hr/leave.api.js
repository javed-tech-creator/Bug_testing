import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const leaveApi = createApi({
  reducerPath: "leave",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Leave"], 
  endpoints: (builder) => ({
    // Employee Routes 
    applyLeave: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/leave/apply/${id}`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["Leave"],
    }),

    getMyLeaves: builder.query({
      query: ({ id }) => ({
        url: `/hr/leave/my-leaves/${id}`,
        method: "GET",
      }),
      providesTags: ["Leave"],
    }),

    editLeave: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/hr/leave/edit/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["Leave"],
    }),

    deleteLeave: builder.mutation({
      query: ({ id }) => ({
        url: `/hr/leave/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leave"],
    }),

    // Admin Routes
    getAllEmployeeLeaves: builder.query({
      query: () => ({
        url: "/hr/leave/all",
        method: "GET",
      }),
      providesTags: ["Leave"],
    }),

    getSingleLeaveSummary: builder.query({
      query: ({ id }) => ({
        url: `/hr/leave/summary/${id}`,
        method: "GET",
      }),
      providesTags: ["Leave"],
    }),

    getTodayLeaves: builder.query({
      query: () => ({
        url: "/hr/leave/today",
        method: "GET",
      }),
      providesTags: ["Leave"],
    }),

    getLeavesByCity: builder.query({
      query: ({ id }) => ({
        url: `/hr/leave/by-city/${id}`,
        method: "GET",
      }),
      providesTags: ["Leave"],
    }),

    approveLeave: builder.mutation({
      query: ({ id }) => ({
        url: `/hr/leave/approve/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Leave"],
    }),

    rejectLeave: builder.mutation({
      query: ({ id }) => ({
        url: `/hr/leave/reject/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Leave"],
    }),

    getLeaveChart: builder.query({
      query: () => ({
        url: "/hr/leave/chart",
        method: "GET",
      }),
      providesTags: ["Leave"],
    }),
  }),
});

export const {
  // Employee
  useApplyLeaveMutation,
  useGetMyLeavesQuery,
  useEditLeaveMutation,
  useDeleteLeaveMutation,
  
  // Admin
  useGetAllEmployeeLeavesQuery,
  useGetSingleLeaveSummaryQuery,
  useGetTodayLeavesQuery,
  useGetLeavesByCityQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
  useGetLeaveChartQuery,
} = leaveApi;