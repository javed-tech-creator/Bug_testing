import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const TodayDesignsApi = createApi({
    reducerPath: "TodayDesignsApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["TodayDesigns"],

    endpoints: (builder) => ({
        // get all today designs
        getAllTodayDesigns: builder.query({
            query: ({ page, limit, decision }) => ({
                url: "design/today-list",
                method: "GET",
                params: { page, limit, decision }
            }),
            providesTags: ["TodayDesigns"]
        })
    })
})


export const {
    useGetAllTodayDesignsQuery
} = TodayDesignsApi;


