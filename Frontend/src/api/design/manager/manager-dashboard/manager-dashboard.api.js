import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const ManagerDashboardApi = createApi({
    reducerPath: "ManagerDashboardApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["ManagerDashboard"],

    endpoints: (builder) => ({

        // get the manager dashboard data
        getManagerDashboardData: builder.query({
            query: () => ({
                url: "/design/manager-dashboard/stats-count",
                method: "GET"
            }),
            providesTags: ["ManagerDashboard"]
        }),

        // get the modification data
        getManagerDashModificationData: builder.query({
            query: () => ({
                url: "/design/manager-dashboard/under-modification",
                method: "GET"
            }),
            providesTags: ["ManagerDashboard"]
        })
    })
})


export const {
    useGetManagerDashboardDataQuery,
    useGetManagerDashModificationDataQuery
} = ManagerDashboardApi;