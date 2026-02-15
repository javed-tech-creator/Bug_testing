import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const RecceExeNextDayPlanningApi = createApi({
    reducerPath: "RecceExeNextDayPlanningApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["RecceExeNextDayPlanning"],

    endpoints: (builder) => ({

        // get the next day planning list
        getRecceExeAllNextDayPlanning: builder.query({
            query: ({ page, limit }) => ({
                url: "/recce/executive/next-day-planning-list",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["RecceExeNextDayPlanning"]
        }),

        // get list by decisions
        getRecceExeAllDecisionsList: builder.query({
            query: ({ page, limit , decision}) => ({
                url: "/recce/executive/recce-all-by-decision",
                method: "GET",
                params: { page, limit, decision }
            }),
            providesTags: ["RecceExeNextDayPlanning"]
        }),




    })
})


export const {
    useGetRecceExeAllNextDayPlanningQuery,
    useGetRecceExeAllDecisionsListQuery
} = RecceExeNextDayPlanningApi;