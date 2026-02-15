import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const ViewDesignOptionApi = createApi({
    reducerPath: "ViewDesignOptionApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["ViewDesignOption"],

    endpoints: (builder) => ({

        // get the all view designs
        getAllViewDesigns: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/design-upload/get",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["ViewDesignOption"]
        }),

        // upload design api
        uploadDesignVersion: builder.mutation({
            query: ({ data }) => ({
                url: "/design/design-upload/version",
                method: "POST",
                data
            }),
            providesTags: ["ViewDesignOption"]
        }),

        // mark as mock-up started for the approved design options
        markAsMockUpStarted: builder.mutation({
            query: ({ id }) => ({
                url: `/design/mark-as-mockup-started/${id}`,
                method: "POST",
            }),
            providesTags: ["ViewDesignOption"]
        }),



        // ========================== design mockup section start =================

        // =========== 1. upload mockup page =====
        // get the all uploaded designs
        getAllUploadedMockup: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/mockup",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["ViewDesignOption"]
        }),
        // add the mockup designs
        addMockUpDesign: builder.mutation({
            query: ({ data }) => ({
                url: "/design/mockup",
                method: "POST",
                data
            }),
            invalidatesTags: ["ViewDesignOption"]
        }),


        // =========== 2. view mockup page =====
        // get the all view designs
        getAllViewMockUp: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/mockup/view-lists",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["ViewDesignOption"]
        }),

        // modify the mockup
        updateMockUpDesign: builder.mutation({
            query: ({ id, data }) => ({
                url: "/design/mockup/" + id,
                method: "PATCH",
                data
            }),
            invalidatesTags: ["ViewDesignOption"]
        }),

        // start measurement 
        markAsMeasurementStarted: builder.mutation({
            query: ({ id }) => ({
                url: "/design/mark-as-measurement-started/" + id,
                method: "POST"
            }),
            invalidatesTags: ["ViewDesignOption"]
        }),

        // ============ 3.Version for approval page - only for the manager
        // get all version approval list 
        getAllVersionForApprovalDesign: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/mockup/manager-get",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["ViewDesignOption"]
        }),


        // ========================== design mockup section end =================





        // ========================== measurement quatation related start =================


        //  Get measurement quotation list
        getMeasurementQuotationList: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/measurement-quotation/get-list",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["ViewDesignOption"],
        }),

        //  Create measurement quotation
        createMeasurementQuotation: builder.mutation({
            query: ({ data }) => ({
                url: "/design/measurement-quotation/create",
                method: "POST",
                data,
            }),
            invalidatesTags: ["ViewDesignOption"],
        }),

        //  View measurement quotation list (details / view page)
        getMeasurementQuotationViewList: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/measurement-quotation/view-list",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["ViewDesignOption"],
        }),

        //  Update measurement quotation
        updateMeasurementQuotation: builder.mutation({
            query: ({ id, data }) => ({
                url: `/design/measurement-quotation/update/${id}`,
                method: "PUT",
                data: data,
            }),
            invalidatesTags: ["ViewDesignOption"],
        }),


        // final submission of measurement quotation
        finalSubmitMeasurementQuotation: builder.mutation({
            query: ({ data }) => ({
                url: "/design/review-submit",
                method: "POST",
                data
            }),
            invalidatesTags: ["ViewDesignOption"],
        }),


        // get measurement approval list
        getMeasurementApprovalList: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/measurement-quotation/manager-list-for-approval",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["ViewDesignOption"]
        })

        // ========================== measurement quatation related end =================


    })
})


export const {
    useGetAllViewDesignsQuery,
    useUploadDesignVersionMutation,
    useMarkAsMockUpStartedMutation,

    // uploaded mockup section start
    useGetAllUploadedMockupQuery,
    useAddMockUpDesignMutation,

    // view Mockup page started
    useGetAllViewMockUpQuery,
    useUpdateMockUpDesignMutation,
    useMarkAsMeasurementStartedMutation,

    // Version for approval page started
    useGetAllVersionForApprovalDesignQuery,

    useGetMeasurementQuotationListQuery,
    useCreateMeasurementQuotationMutation,
    useGetMeasurementQuotationViewListQuery,
    useUpdateMeasurementQuotationMutation,
    useFinalSubmitMeasurementQuotationMutation,
    useGetMeasurementApprovalListQuery
} = ViewDesignOptionApi;