import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const RecceWaitingLostApi = createApi({
    reducerPath: "RecceWaitingLostApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["RecceWaitingLost"],

    endpoints: (builder) => ({

        // get the all waiting and last list for the recce manager and executive
        getRecceAllWaitingLostList: builder.query({
            query: ({ page, limit, status, type }) => ({
                url: "/recce/manager/waiting-or-lost-recce",
                method: "GET",
                params: { page, limit,status, type }
            }),
            providesTags: ["RecceWaitingLost"]
        })

    })
})

export const {
    useGetRecceAllWaitingLostListQuery
} = RecceWaitingLostApi;