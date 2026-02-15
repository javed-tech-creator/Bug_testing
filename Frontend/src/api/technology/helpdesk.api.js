import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const helpDeskApi = createApi({
  reducerPath: "helpDeskApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["HelpDesk"],

  endpoints: (builder) => ({
 
 //  Create Ticket (with file upload)
    addTicket: builder.mutation({
      query: (formData) => ({
        url: "/tech/helpdesk/add",
        method: "POST",
        data: formData, // FormData object (with attachment if any)
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["HelpDesk","DashboardSummary","TicketsByDepartment"],
    }),

    //  Get Tickets (list / pagination if needed)
    getTickets: builder.query({
      query: ({ page, limit }) => ({
        url: `/tech/helpdesk/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["HelpDesk"],
    }),

    //  Assign Ticket
    assignTicket: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/helpdesk/assign/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["HelpDesk"],
    }),

    //  Update Ticket Status
    updateTicketStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/helpdesk/ticket-status/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["HelpDesk","DashboardSummary","TicketsByDepartment"],
    }),

  }),
});

export const {
  useAddTicketMutation,
  useGetTicketsQuery,
  useAssignTicketMutation,
  useUpdateTicketStatusMutation,
} = helpDeskApi;
