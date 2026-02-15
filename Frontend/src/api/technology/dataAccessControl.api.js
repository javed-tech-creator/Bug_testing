import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const dataAccessControlApi = createApi({
  reducerPath: "dataAccessControlApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AccessControl"],

  endpoints: (builder) => ({
 

    //  GET All Access Records
    getAccessRecords: builder.query({
      query: ({ page, limit }) => ({
        url: `/tech/access-control/get?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["AccessControl"],
    }),

    //  CREATE Access Record
    addAccess: builder.mutation({
      query: (data) => ({
        url: "/tech/access-control/add",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["AccessControl"],
    }),

    //  UPDATE Access Record
    updateAccess: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/access-control/update/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["AccessControl"],
    }),

    //  DELETE Access Record
    deleteAccess: builder.mutation({
      query: (id) => ({
        url: `/tech/access-control/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AccessControl"],
    }),

//  PATCH Revoke Access
revokeAccess: builder.mutation({
  query: ({ id, accessRevoked }) => ({
    url: `/tech/access-control/revoke/${id}`,
    method: "PATCH",
    data: { accessRevoked }, // <-- body yaha bhejna hai
  }),
  invalidatesTags: ["AccessControl"],
}),



  }),
});

export const {
 useGetAccessRecordsQuery,
  useAddAccessMutation,
  useUpdateAccessMutation,
  useDeleteAccessMutation,
  useRevokeAccessMutation,
} = dataAccessControlApi;
