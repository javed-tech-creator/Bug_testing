import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const vendorDraftApi = createApi({
  reducerPath: "vendorDraftApi", // ✅ remove extra space
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Drafts"],

  endpoints: (builder) => ({
    // ✅ Create or Update Draft
    createOrUpdateDraft: builder.mutation({
      query: (draftData) => ({
        url: "/vendor/create-invoicedraft",
        method: "POST",
        data: draftData,
      }),
      invalidatesTags: ["Drafts"], // so list refreshes
    }),

    // ✅ Get Drafts
 getDrafts: builder.query({
  query: ({ page, limit, startDate, endDate } = {}) => {
    let url = `/vendor/get-invoicedraft?page=${page}&limit=${limit}`;

    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    return { url, method: "GET" };
  },
  providesTags: ["Drafts"],
}),

    // ✅ Get Draft By ID
    getDraftById: builder.query({
      query: (draftId) => ({
        url: `/vendor/get-single-invoicedraft/${draftId}`,
        method: "GET",
      }),
    }),

  // ✅ Delete Draft
    deleteDraft: builder.mutation({
      query: (draftId) => ({
        url: `/vendor/delete-invoicedraft/${draftId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Drafts"], // refetch list after delete
    }),


  }),
});

// ✅ Correct hook exports
export const {
  useCreateOrUpdateDraftMutation,
  useGetDraftsQuery,
   useGetDraftByIdQuery,
    useDeleteDraftMutation,
} = vendorDraftApi;
