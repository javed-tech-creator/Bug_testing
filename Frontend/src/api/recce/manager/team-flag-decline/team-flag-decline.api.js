import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const ManagerTeamFlagDeclinedApi = createApi({
    reducerPath: "ManagerTeamFlagDeclinedApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["ManagerTeamFlagDeclined"],

    endpoints: builder => ({

        // get all declined and flagged list api
        getMangerTeamDeclineFlagList: builder.query({
            query: ({ page, limit, type }) => ({
                url: "recce/assign/manager-team-flag-or-decline-recce",
                method: "GET",
                params: { page, limit, type }
            }),
            providesTags: ["ManagerTeamFlagDeclined"]
        })
    })

})


export const {
    useGetMangerTeamDeclineFlagListQuery
} = ManagerTeamFlagDeclinedApi;