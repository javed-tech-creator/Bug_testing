import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const DesignWorkFlowApi = createApi({
    reducerPath: "DesignWorkFlowApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["DesignWorkFlow"],


    endpoints: (builder) => ({

        // get all design workflow list to upload
        getAllDesignWorkFlow: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/get-workflow-upload",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["DesignWorkFlow"]
        }),

        // upload design api
        uploadDesignOptions: builder.mutation({
            query: ({ data }) => ({
                url: "/design/design-upload/options",
                method: "POST",
                data
            }),
            invalidatesTags: ["DesignWorkFlow"]
        }),



        // =========================== options for approval section start ====================

        // get the all design options 
        getAllDesignOptionList: builder.query({
            query: ({ page, limit, type }) => ({
                url: "/design/design-upload/manager-options-version/" + type,
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["OptionForApproval"],
        })

    })
})

export const {
    useGetAllDesignWorkFlowQuery,
    useUploadDesignOptionsMutation,

    // =========================== options for approval section start ====================

    useGetAllDesignOptionListQuery
} = DesignWorkFlowApi;