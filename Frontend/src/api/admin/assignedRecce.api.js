import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const assignedRecceApi = createApi({
  reducerPath: "assignedRecceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["assignedRecce"],
  endpoints: (builder) => ({
    // Get all assigned recce (accepted ones)
    getAssignedRecce: builder.query({
      query: () => ({
        url: `sales/project`,
        method: "GET",
      }),
      providesTags: ["assignedRecce"],
    }),

    // Get total recce (pending for approval)
    getTotalRecce: builder.query({
      query: () => ({
        url: `/recce/total`,
        method: "GET",
      }),
      providesTags: ["assignedRecce"],
    }),

    getAssignedRecceById: builder.query({
      query: (id) => ({
        url: `sales/project/${id}`,
        method: "GET",
      }),
      providesTags: ["assignedRecce"],
    }),

    getAcceptedRecce: builder.query({
      query: (params) => ({
        url: `/recce/accepted`,
        method: "GET",
        params,
      }),
      providesTags: ["assignedRecce"],
    }),

    // Get manager-assigned recce list (filtered by assignedTo optional)
    getAssignedRecceList: builder.query({
      query: (params) => ({
        url: `/recce/assigned`,
        method: "GET",
        params,
      }),
      providesTags: ["assignedRecce"],
    }),

    getRejectedRecce: builder.query({
      query: (params) => ({
        url: `/recce/rejected`,
        method: "GET",
        params,
      }),
      providesTags: ["assignedRecce"],
    }),

    getFlagRaisedRecce: builder.query({
      query: (params) => ({
        url: `/recce/flag-raised`,
        method: "GET",
        params,
      }),
      providesTags: ["assignedRecce"],
    }),

    updateRecceDetails: builder.mutation({
      query: (payload) => ({
        url: `/admin/recce/update`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["assignedRecce"],
    }),

    acceptRecce: builder.mutation({
      query: (id) => ({
        url: `/recce/accept/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["assignedRecce"],
    }),

    rejectRecce: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/recce/reject/${id}`,
        method: "PUT",
        data: { reason },
      }),
      invalidatesTags: ["assignedRecce"],
    }),

    assignRecce: builder.mutation({
      query: (payload) => ({
        url: `/admin/recce/assign`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["assignedRecce"],
    }),
  }),
});

export const {
  useGetAssignedRecceQuery,
  useGetTotalRecceQuery,
  useGetAssignedRecceByIdQuery,
  useGetAcceptedRecceQuery,
  useGetAssignedRecceListQuery,
  useGetRejectedRecceQuery,
  useGetFlagRaisedRecceQuery,
  useUpdateRecceDetailsMutation,
  useAcceptRecceMutation,
  useRejectRecceMutation,
  useAssignRecceMutation,
} = assignedRecceApi;
