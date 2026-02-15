 
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const taxDeductApi = createApi({
    reducerPath: "taxDeductApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/account" }),
    tagTypes: ["TDeduct"],

    endpoints: (builder) => ({
       
        getTaxDeducts: builder.query({
            query: () => ({ url: "/taxdeduct", method: "GET" }),
            providesTags: ["TDeduct"],
        }),
 
        deleteTaxDeduct: builder.mutation({
            query: (id) => ({ url: `/taxdeduct/${id}`, method: "DELETE" }),
            invalidatesTags: ["TDeduct"],
        }),
 
    updateTaxDeduct: builder.mutation({
    query: ({ id, data }) => ({
        url: `/taxdeduct/${id}`,
        method: "PUT",
        data: data, 
        headers: {
            "Content-Type": "application/json",
        },
        invalidatesTags: ["TDeduct"],
    }),
}),
         
        uploadChallan: builder.mutation({
            query: (formData) => ({
                url: "/challan/uploadchallan",
                method: "POST",
                data: formData, 
            }),
            invalidatesTags: ["TDeduct"],
        }),

         
        exportGSTReport: builder.query({
            query: () => ({ url: "/exportgst/export/gst", method: "GET" }),
        }),
    }),
});

export const {
    useGetTaxDeductsQuery,
    useDeleteTaxDeductMutation,
    useUpdateTaxDeductMutation,
    useUploadChallanMutation,
    useExportGSTReportQuery,
} = taxDeductApi;
