import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const campaignManagementApi = createApi({
  reducerPath: "campaignManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Campaign"],

  endpoints: (builder) => ({
 
     createCampaign: builder.mutation({
      query: (data) => ({
        url: "marketing/campaign/create",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Campaign"],
    }),

    // Update Campaign
    updateCampaign: builder.mutation({
      query: ({ id, data }) => ({
        url: `marketing/campaign/update/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Campaign"],
    }),

    updateCampaignStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `marketing/campaign/status/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["Campaign"],
    }),

    // Get Campaigns
 getCampaigns: builder.query({
  query: ({ page,limit  }) => ({
    url: `marketing/campaign/get?page=${page}&limit=${limit}`,
    method:"GET",
  }),
  providesTags: ["Campaign"],
}),

  // Get all Campaignlists
 getCampaignlLists: builder.query({
  query: () => ({
    url: "marketing/campaign/get-campaignlists",
    method:"GET",
  }),
}),


    // Delete Campaign
    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: `marketing/campaign/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaign"],
    }),


  }),
});

export const {
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useUpdateCampaignStatusMutation,
  useGetCampaignsQuery,
  useGetCampaignlListsQuery,
  useDeleteCampaignMutation,

} = campaignManagementApi;
