import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const LostWaitingApi = createApi({
    reducerPath: "LostWaitingApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["LostWaiting"],

    endpoints: (builder) => ({
        // get all lost and waiting designs
        getAllLostWaiting: builder.query({
            query: ({ page, limit, type, status }) => ({
                url: "/design/lost-or-waiting-list",
                method: "GET",
                params: { page, limit, type, status }
            }),
            providesTags: ["LostWaiting"]
        })
    })
})


export const { useGetAllLostWaitingQuery } = LostWaitingApi;