import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const NextDayPlanningExceApi = createApi({
    reducerPath: "NextDayPlanningExceApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["NextDayPlanningExec"],

    endpoints: (builder) => ({

        // getAllNextDayPlanningApis
        getAllNextDayPlanning: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/executive/next-day-planning",
                method: "GET",
                param: { page, limit }
            }),
            providesTags: ["NextDayPlanning"]
        }),


        // ================== [Dashboard page api] ==================

        // get the dashboard data
        getDashboardData: builder.query({
            query: () => ({
                url: "/design/executive-dashboard/stats-count",
                method: "GET"
            }),
            providesTags: ["DashboardExce"]
        })

    })
})


export const {
    useGetAllNextDayPlanningQuery,
    useGetDashboardDataQuery
} = NextDayPlanningExceApi;