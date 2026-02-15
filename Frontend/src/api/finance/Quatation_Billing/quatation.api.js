// import { createApi } from "@reduxjs/toolkit/query/react";
// import { axiosBaseQuery } from "../../axiosBaseQuery";

// export const quotationApi = createApi({
//   reducerPath: "quotationApi",
//   baseQuery: axiosBaseQuery({ baseUrl: "/billing" }),
//   tagTypes: ["Quotation"],

//   endpoints: (builder) => ({
//     // GET All Quotations
//     getQuotations: builder.query({
//       query: () => ({ url: "/quotations", method: "GET" }),
//       transformResponse: (response) => response.q,
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ _id }) => ({ type: "Quotation", id: _id })),
//               { type: "Quotation", id: "LIST" },
//             ]
//           : [{ type: "Quotation", id: "LIST" }],
//     }),

//     // CREATE Quotation

//     createQuotation: builder.mutation({
//       query: (newQuotation) => ({ url: "/quotations", method: "POST", data: newQuotation }),
//       invalidatesTags: [{ type: "Quotation", id: "LIST" }],
//     }),

//     // SEND Quotation
//     sendQuotation: builder.mutation({
//       query: (id) => ({ url: `/${id}/send`, method: "POST" }),
//       invalidatesTags: (result, error, id) => [{ type: "Quotation", id }],
//     }),

//     // APPROVE Quotation
//     approveQuotation: builder.mutation({
//       query: (id) => ({ url: `/${id}/approve`, method: "POST" }),
//       invalidatesTags: (result, error, id) => [{ type: "Quotation", id }],
//     }),
//   }),
// });

// export const {
//   useGetQuotationsQuery,
//   useCreateQuotationMutation,
//   useSendQuotationMutation,
//   useApproveQuotationMutation,
// } = quotationApi;


import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const quotationApi = createApi({
  reducerPath: "quotationApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/billing" }),
  tagTypes: ["Quotation"],
  endpoints: (builder) => ({
    // GET All Quotations
    getQuotations: builder.query({
      query: () => ({ url: "/quotations", method: "GET" }),
      transformResponse: (response) => response.q,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ _id }) => ({ type: "Quotation", id: _id })),
            { type: "Quotation", id: "LIST" },
          ]
          : [{ type: "Quotation", id: "LIST" }],
    }),
    // CREATE Quotation
    createQuotation: builder.mutation({
      query: (newQuotation) => ({ url: "/quotations", method: "POST", data: newQuotation }),
      invalidatesTags: [{ type: "Quotation", id: "LIST" }],
    }),
    // SEND Quotation
    sendQuotation: builder.mutation({
      query: (id) => ({ url: `/quotations/${id}/send`, method: "POST" }), // Fixed URL
      invalidatesTags: (result, error, id) => [{ type: "Quotation", id }],
    }),
    // APPROVE Quotation
    approveQuotation: builder.mutation({
      query: (id) => ({ url: `/quotations/${id}/approve`, method: "POST" }), // Fixed URL
      invalidatesTags: (result, error, id) => [{ type: "Quotation", id }],
    }),
updateQuotation: builder.mutation({
  query: ({ id, ...body }) => ({
    url: `/quotations/${id}`,
    method: "PUT",
    data: body,   
  }),
  invalidatesTags: (result, error, { id }) => [{ type: "Quotation", id }],
}),
deleteQuotation: builder.mutation({
  query: ({ id, ...body }) => ({
    url: `/quotations/${id}`,
    method: "PUT",
    data: body,   
  }),
  invalidatesTags: (result, error, { id }) => [{ type: "Quotation", id }],
}),
    // InvoiceViewQuatation:builder.mutation({
    //   query:(id)=>({url:`/invoices/${id}`,method:'GET'}),
    //   invalidatesTags: (result, error, id) => [{ type: "Quotation", id }],
    // })
  }),
});

export const {
  useDeleteQuotationMutation,
  useGetQuotationsQuery,
  useCreateQuotationMutation,
  useSendQuotationMutation,
  useApproveQuotationMutation,
  useUpdateQuotationMutation
  // useInvoiceViewQuatationMutation
} = quotationApi;