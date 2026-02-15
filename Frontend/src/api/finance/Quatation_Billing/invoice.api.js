// invoice.api.js
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const invoiceApi = createApi({
  reducerPath: "invoiceApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/billing" }),
  endpoints: (builder) => ({
    getInvoicePdf: builder.query({
      
    query: (quotationId) => ({
  url: `/quatationinv/${quotationId}/pdf`,
  method: "GET",
  responseType: "blob", // <-- ye zaruri hai
}),
    }),
  }),
});

export const { useGetInvoicePdfQuery } = invoiceApi;
