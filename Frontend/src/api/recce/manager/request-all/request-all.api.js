import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const RequestAllApi = createApi({
    reducerPath: "RequestAllApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["RequestAll"],


    endpoints: builder => ({

        // get the sales in list
        getAllReqDesignList: builder.query({
            query: ({ page, limit, type }) => ({
                url: "/recce/request/all-list",
                method: "GET",
                params: { page, limit, type }
            }),
            providesTags: ["RequestAll"]
        }),
        //  sales in design page form
        recceDecisionResponse: builder.mutation({
            query: (body) => ({
                url: "/recce/request/decision-response",
                method: "POST",
                data: body,
            }),
            invalidatesTags: ["RequestAll"],
        }),

        // received recce page modal form
        managerAssignRecce: builder.mutation({
            query: (body) => ({
                url: "/recce/assign/recce-assigned",
                method: "POST",
                data: body,
            }),
            invalidatesTags: ["RequestAll"],
        }),

        // fetch department executives
        getDepartmentExecutives: builder.query({
            query: () => ({
                url: "/recce/assign/",
                method: "GET",
            }),
        }),



    })
})


export const {
    useGetAllReqDesignListQuery,

    //  sales in design page form
    useRecceDecisionResponseMutation,
    useManagerAssignRecceMutation,
    useGetDepartmentExecutivesQuery
} = RequestAllApi;