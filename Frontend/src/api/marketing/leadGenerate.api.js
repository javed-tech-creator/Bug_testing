import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const leadManagementApi = createApi({
  reducerPath: "leadManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Lead"],

  endpoints: (builder) => ({

  // Add Lead
    // addLead: builder.mutation({
    //   query: (data) => ({
    //     url: 'marketing/lead-generate/add',
    //     method: 'POST',
    //     data: data,
    //   }),
    //   invalidatesTags: ['Lead'],
    // }),

    // assign lead to sales team
        assignLead: builder.mutation({
      query: (data) => ({
        url: 'marketing/lead-generate/assign-lead',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Lead'],
    }),
    
    
    // Get all leads
    getLeads: builder.query({
      query: ({ page,limit,source,isForwarded }) =>({
         url:`marketing/lead-generate/get?page=${page}&limit=${limit}&source=${source}&isForwarded=${isForwarded}`,
         method:"GET",
      }),
      providesTags: ['Lead'],
    }),


    // Update lead
    // updateLead: builder.mutation({
    //   query: ({ id, ...data }) => ({
    //     url: `marketing/lead-generate/update/${id}`,
    //     method: 'PUT',
    //     data: data,
    //   }),
    //   invalidatesTags: ['Lead'],
    // }),

    // Delete lead
    // deleteLead: builder.mutation({
    //   query: (id) => ({
    //     url: `marketing/lead-generate/delete/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Lead'],
    // }),

  }),
});

export const {
//  useAddLeadMutation,
 useAssignLeadMutation,
  useGetLeadsQuery,
  // useUpdateLeadMutation,
  // useDeleteLeadMutation,
} = leadManagementApi;
