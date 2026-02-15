import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const ManagerDesignRequestedApi = createApi({
  reducerPath: "ManagerDesignRequestedApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ManagerDesignRequested"],

  endpoints: (builder) => ({
    // GET All Requested Design By Decision
    getAllDesignRequestedByDecision: builder.query({
      query: ({ page, limit, decision }) => ({
        url: `design/requested?page=${page}&limit=${limit}${decision ? `&decision=${decision}` : ""
          }`,
        method: "GET",
      }),
      providesTags: ["ManagerDesignRequested"],
    }),

    // POST design request received by manager
    designRequestedReceivedByManager: builder.mutation({
      query: (data) => ({
        url: "design/request-received",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ManagerDesignRequested"],
    }),

    // get the all flag-raise and declined designs for the team
    getAllFlagDeclinedTeamDesign: builder.query({
      query: ({page, limit, type}) => ({
        url: "/design/assignment/team-decline-lost",
        method: "GET",
        params:{page,limit,type}
      }),
      providesTags: ["ManagerDesignRequested"]
    })



  }),
});

// Export hooks
export const {
  useGetAllDesignRequestedByDecisionQuery,
  useDesignRequestedReceivedByManagerMutation,
  useGetAllFlagDeclinedTeamDesignQuery
} = ManagerDesignRequestedApi;
