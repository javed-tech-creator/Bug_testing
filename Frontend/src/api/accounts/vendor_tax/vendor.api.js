// src/redux/vendorApis.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const vendorTaxApi = createApi({
    reducerPath: "vendorTaxApi",
    baseQuery: axiosBaseQuery({ baseUrl: "/account/Vendertax" }),
    tagTypes: ["Vendorr"],
    endpoints: (builder) => ({
        getVendors: builder.query({
            query: () => ({ url: "/", method: "GET" }),
            providesTags: (result = []) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: "VT", id: _id })), // each vendor
                        { type: "VT", id: "LIST" }, // the whole list
                    ]
                    : [{ type: "VT", id: "LIST" }],
        }),

        addVendor: builder.mutation({
            query: (vendor) => ({ url: "/", method: "POST", data: vendor }),
            invalidatesTags: [{ type: "VT", id: "LIST" }], // invalidate whole list
        }),

        updateVendor: builder.mutation({
            query: ({ id, ...vendor }) => ({ url: `/${id}`, method: "PUT", data: vendor }),
            invalidatesTags: [{ type: "VT", id: "LIST" }], // invalidate whole list
        }),

        deleteVendor: builder.mutation({
            query: (id) => ({ url: `/${id}`, method: "DELETE" }),
            invalidatesTags: [{ type: "VT", id: "LIST" }],
        }),
    }),
});

export const {
    useGetVendorsQuery,
    useAddVendorMutation,
    useUpdateVendorMutation,
    useDeleteVendorMutation,
} = vendorTaxApi;
