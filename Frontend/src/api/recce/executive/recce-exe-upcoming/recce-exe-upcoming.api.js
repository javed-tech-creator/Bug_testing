import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const RecceExeUpcomingApi = createApi({
    reducerPath: "RecceExeUpcomingApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["RecceExeUpcoming"],

    endpoints: (builder) => ({

        // get the next day planning list
        getRecceExeUpcoming: builder.query({
            query: ({ page, limit }) => ({
                url: "/recce/executive/upcoming-recce-list",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["RecceExeUpcoming"]
        })

    })
})


export const {
    useGetRecceExeUpcomingQuery
} = RecceExeUpcomingApi;