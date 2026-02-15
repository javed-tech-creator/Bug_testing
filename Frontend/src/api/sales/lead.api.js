import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const leadApi = createApi({
  reducerPath: "lead",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["lead"],
  endpoints: (builder) => ({
    addLead: builder.mutation({
      query: ({ formData }) => ({
        url: "/sales/lead",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["lead"],
    }),

    updateLead: builder.mutation({
      query: ({ id: leadId, formData }) => ({
        url: `/sales/lead/${leadId}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["lead"],
    }),
    scheduleFollowUp: builder.mutation({
      query: (formData) => ({
        url: `/sales/lead/schedule-followup`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["lead"],
    }),

    fetchLeadById: builder.query({
      query: ({ id }) => ({
        url: `/sales/lead/${id}`,
        method: "GET",
      }),
    }),

    fetchLeads: builder.query({
      query: ({ params = null }) => ({
        url: `/sales/lead?${params}`,
        method: "GET",
      }),
      providesTags: ["lead"],
    }),

    fetchLeadsByEmployeeId: builder.query({
      query: ({ id }) => ({
        url: `/sales/lead?assignTo=${id}`,
        method: "GET",
      }),
      providesTags: ["lead"],
    }),

    fetchMyLeads: builder.query({
      query: ({ id }) => ({
        url: `/lead/get/our/${id}`,
        method: "GET",
      }),
      providesTags: ["lead"],
    }),

    fetchPendingLeads: builder.query({
      query: () => ({
        url: "/lead/pending-list",
        method: "GET",
      }),
      providesTags: ["lead"],
    }),

    assignLead: builder.mutation({
      query: ({ id, formData }) => (
        console.log(id, formData),
        {
          url: `/sales/lead/assign/${id}`,
          method: "PATCH",
          data: formData,
        }
      ),
      invalidatesTags: ["lead"],
    }),

    assignLeadAccepted: builder.mutation({
      query: ({ id, formData }) => (
        console.log(id, formData),
        {
          url: `/lead/update/${id}`,
          method: "PUT",
          data: formData,
        }
      ),
      invalidatesTags: ["lead"],
    }),

    getUserByBranch: builder.query({
      query: ({ branchId, deptId }) => ({
        url: `/hr/user/query?branch=${branchId}&departmentId=${deptId}`,
        method: "GET",
      }),
    }),
    getUserByQuery: builder.query({
      query: ({ query }) => ({
        url: `/hr/user/query?${query}`,
        method: "GET",
      }),
    }),

    getUserByDepartment: builder.query({
      query: ({ deptId }) => ({
        url: `/hr/user/query?departmentId=${deptId}`,
        method: "GET",
      }),
    }),

    addClientBriefing: builder.mutation({
      query: ({ formData }) => (
        console.log("rtk", formData),
        {
          url: `/sales/client-briefing/create`,
          method: "POST",
          data: formData,
        }
      ),
      invalidatesTags: ["lead"],
    }),

    getEmployeeByZone: builder.mutation({
      query: ({ formData }) => (
        console.log("rtk", formData),
        {
          url: `/sales/client-briefing/create`,
          method: "POST",
          data: formData,
        }
      ),
      invalidatesTags: ["lead"],
    }),
  }),
});

export const {
  useAddLeadMutation,
  useFetchLeadsQuery,
  useLazyFetchLeadsQuery,
  useFetchPendingLeadsQuery,
  useFetchLeadByIdQuery,
  useFetchMyLeadsQuery,
  useAssignLeadMutation,
  useGetUserByBranchQuery,
  useAddClientBriefingMutation,
  useAssignLeadAcceptedMutation,
  useFetchLeadsByEmployeeIdQuery,
  useUpdateLeadMutation,
  useGetEmployeeByZoneMutation,
  useGetUserByDepartmentQuery,
  useLazyGetUserByQueryQuery,
  useScheduleFollowUpMutation,   
} = leadApi;
