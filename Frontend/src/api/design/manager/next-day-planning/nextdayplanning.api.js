import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const NextDayPlanningApi = createApi({
  reducerPath: "NextDayPlanningApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["NextDayPlanning"],

  endpoints: (builder) => ({
    // GET All Next Day Planning
    getAllNextDayPlanning: builder.query({
      query: ({ page, limit, decision }) => ({
        url: "design/assignment/assigned/next-day-planning",
        method: "GET",
        params: { page, limit, decision },
      }),
      providesTags: ["NextDayPlanning"],
    }),

    // PATCH design request approval
    updateNextDayPlanning: builder.mutation({
      query: ({ data, id }) => ({
        url: `design/assignment/${id}/plan-approval`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["NextDayPlanning"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllNextDayPlanningQuery,
  useUpdateNextDayPlanningMutation,
} = NextDayPlanningApi;
