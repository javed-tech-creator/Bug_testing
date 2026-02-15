import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const AssignedExceDesignsApi = createApi({
    reducerPath: "AssignedExceDesignsApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["AssignedExceDesign"],

    endpoints: (builder) => ({

        // get all desgins assigned to executive
        getAllAssignedExceDesign: builder.query({
            query: ({ page, limit, decision }) => ({
                url: "/design/executive/all-assigned",
                method: "GET",
                params: { page, limit, decision }
            }),
            providesTags: ["AssignedExceDesign"]
        }),


        // confirmation(accept/decline/flag) from the assigned excecutive
        confirmationExceDesign: builder.mutation({
            query: ({ data }) => ({
                url: "/design/executive/received-confirmation",
                method: "POST",
                data
            }),
            invalidatesTags: ['AssignedExceDesign']
        }),


        // =========================> Upcoming page <=========================
        // [get all list]
        getExecutiveAllUpcomingList: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/executive/upcoming-designs",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["AssignedExceDesign"]
        }),
        // [send request for assignment]
        sendRequestForSubmission: builder.mutation({
            query: ({ data }) => ({
                url: "/design/request-for-assignment",
                method: "POST",
                data: data
            }),
            invalidatesTags: ['AssignedExceDesign']
        })

    })
})

export const {
    useGetAllAssignedExceDesignQuery,
    useConfirmationExceDesignMutation,
    useGetExecutiveAllUpcomingListQuery,
    useSendRequestForSubmissionMutation
} = AssignedExceDesignsApi;