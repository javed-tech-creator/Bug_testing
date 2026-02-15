import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const assetManagementApi = createApi({
  reducerPath: "assetManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Asset"],

  endpoints: (builder) => ({
 

    //  GET All Assets
    getAssets: builder.query({
      query: ({ page,limit  }) => ({
        url:`/tech/asset/get?page=${page}&limit=${limit}`,
        }),
      providesTags: ["Asset"],
    }),

    //  CREATE Asset  
    addAsset: builder.mutation({
      query: (data) => ({
        url: "/tech/asset/add",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Asset","DashboardSummary","AssetsDistribution"],
    }),

    //  UPDATE Asset
    updateAsset: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/asset/update/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Asset","AssetsDistribution"],
    }),

    //  PATCH Assign Asset
    patchAsset: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/asset/patch-assign/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ["Asset"],
    }),

    //  DELETE Asset
    deleteAsset: builder.mutation({
      query: (id) => ({
        url: `/tech/asset/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Asset","DashboardSummary","AssetsDistribution"],
    }),


  }),
});

export const {
 useGetAssetsQuery,
  useAddAssetMutation,
  useUpdateAssetMutation,
  usePatchAssetMutation,
  useDeleteAssetMutation,
} = assetManagementApi;
