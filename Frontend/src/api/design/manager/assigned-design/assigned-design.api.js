import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const AssignedDesignsApi = createApi({
    reducerPath: "AssignedDesignsApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["AssignedDesign"],

    endpoints: (builder) => ({
        // get all assigned designs
        getAllAssignedDesigns: builder.query({
            query:({page,limit, assignment_type})=>({
                // url:"/design/assignment/manager-self",
                url:"/design/requested/assigned",
                method:"GET",
                params:{page,limit, assignment_type}
            }),
            providesTags:["AssignedDesign"]
        })
    })
})

export const { useGetAllAssignedDesignsQuery } = AssignedDesignsApi;