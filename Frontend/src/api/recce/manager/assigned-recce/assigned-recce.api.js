import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";


export const AssignedRecceApi = createApi({
    reducerPath: "AssignedRecceApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ['AssignedRecce'],

    endpoints: (builder) => ({

        // get all assigned list
        getAllAssignedList: builder.query({
            query: ({ page, limit, type }) => ({
                url: "/recce/assign/self-or-team",
                method: "GET",
                params: { page, limit, type }
            }),
            providesTags: ["AssignedRecce"]
        })
    })
})


export const {
    useGetAllAssignedListQuery
} = AssignedRecceApi;