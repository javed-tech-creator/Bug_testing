import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const accountQuotationApi = createApi({
  reducerPath: "accountQuotationApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/account/quat" }),
  tagTypes: ["Quotation"],

  endpoints: (builder) => ({
    // GET all quotations
    getQuotations: builder.query({
      query: () => ({ url: "/get/", method: "GET" }),
      providesTags: ["Quotation"],
    }),

    // GET single quotation
    getQuotationById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Quotation"],
    }),

    // CREATE quotation
    createQuotation: builder.mutation({
      query: (newQuotation) => ({
        url: "/",
        method: "POST",
        data: newQuotation,
      }),
      invalidatesTags: ["Quotation"],
    }),

    // DELETE quotation
    deleteQuotation: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quotation"],
    }),
    updateQuotation: builder.mutation({
      query: ({ id, ...newQuotation }) => ({
        url: `/${id}`,
        method: "PUT",
        data: newQuotation,  // ✅ body → data
      }),
      invalidatesTags: ["Quotation"], // note singular, jo tag aap provide kar rahe ho
    }),
 generateInvoicePDF: builder.query({
   query: (id) => ({
     url: `/${id}/Account-invoice`,
     method: "POST",
     responseType: "blob",
   }),
}) 
  })

    
});
 
export const {
  useGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useCreateQuotationMutation,
  useDeleteQuotationMutation,
  useUpdateQuotationMutation,
  useGenerateInvoicePDFQuery,
} = accountQuotationApi;
