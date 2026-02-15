import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";



export const DesignReviewApi = createApi({
    reducerPath: "DesignReviewApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["DesignReview"],

    endpoints: (builder) => ({

        // get design review list
        getAllDesignReviewList: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/review-submit/executive-review-list",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["DesignReview"]
        }),

        // submit design review rating
        addDesignReviewRating: builder.mutation({
            query: ({ data }) => ({
                url: "/design/review-submit/executive-submit-feedback",
                method: "POST",
                data: data
            }),
            invalidatesTags: ["DesignReview"]
        }),



        // ======================================== manager related started ===============================

        // [=================> Design Review <==================]
        // get design review list
        getManagerAllDesignReviewList: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/review-submit/get-pending-review",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["DesignReview"]
        }),

        // submit design review rating
        addManagerDesignReviewRating: builder.mutation({
            query: ({ data }) => ({
                url: "/design/review-submit/manager-final-submit",
                method: "POST",
                data: data
            }),
            invalidatesTags: ["DesignReview"]
        }),


        // [================> Design Quotation <===================]
        // get all design quotation list
        getManagerAllDesignQuotation: builder.query({
            query: ({ page, limit }) => ({
                url: "/design/review-submit/get-approved-review",
                method: "GET",
                params: { page, limit }
            }),
            providesTags: ["DesignReview"]
        }),

        // send design to quotation 
        sendManagerDesignQuotation: builder.mutation({
            query: ({ data }) => ({
                url: "/design/review-submit/send-to-quotation",
                method: "POST",
                data: data
            }),
            invalidatesTags: ["DesignReview"]
        })

        // ======================================== manager related started ===============================

    })
})


export const {
    useGetAllDesignReviewListQuery,
    useAddDesignReviewRatingMutation,


    // manager related started
    useGetManagerAllDesignReviewListQuery,
    useAddManagerDesignReviewRatingMutation,
    useGetManagerAllDesignQuotationQuery,
    useSendManagerDesignQuotationMutation
} = DesignReviewApi;