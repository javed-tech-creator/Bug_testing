import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const WaitingLostExceDesignsApi = createApi({
    reducerPath: "WaitingLostExceDesignsApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["WaitingLostExceDesigns"],

    endpoints: (builder) => ({

        // get all waiting/lost designs
        getAllWaitingLostExceDesigns: builder.query({
            query: ({ page, limit, status, type }) => ({
                url: "/design/lost-or-waiting-list",
                method: "GET",
                params: { page, limit, status, type }
            }),
            providesTags: ["WaitingLostExceDesigns"]
        })


    })
})


export const { useGetAllWaitingLostExceDesignsQuery } = WaitingLostExceDesignsApi;