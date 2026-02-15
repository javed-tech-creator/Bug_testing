import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const TodayRecceApi =  createApi({
    reducerPath: "TodayRecceApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["TodayRecce"],

    endpoints: (builder) => ({
        // get today all recce list

        getTodayAllRecceList: builder.query({
            query:({page, limit}) => ({
                url: "/recce/common/today-planned-recce",
                method: "GET",
                params: { page,limit}
            }),
            providesTags:["TodayRecce"]
        })
    })
})


export const {
    useGetTodayAllRecceListQuery
} = TodayRecceApi;