import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const RecceNextDayPlanningApi = createApi({
    reducerPath: "RecceNextDayPlanningApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["RecceNextDayPlanning"],

    endpoints: (builder) => ({

        // get the next day planning list
        getRecceAllNextDayPlanning: builder.query({
            query: ({ page, limit }) => ({
                url: "/recce/assign/manager-next-day-planning",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["RecceNextDayPlanning"]
        })

    })
})


export const {
    useGetRecceAllNextDayPlanningQuery
} = RecceNextDayPlanningApi;