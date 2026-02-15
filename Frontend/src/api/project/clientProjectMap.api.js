import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const ClientProjectMapApi = createApi({
  reducerPath: "ClientProjectMapApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ClientProjectMap"],
  endpoints: (builder) => ({
    assignCoordinator: builder.mutation({
      query: (data) => ({
        url: "/project/client-project-map/assign-coordinator",
        method: "POST",
        data,
      }),
      invalidatesTags: ["ClientProjectMap"],
    }),

    getClientProjectMapByClientId: builder.query({
      query: (clientId) => ({
        url: `/project/client-project-map/client/${clientId}`,
        method: "GET",
      }),
      providesTags: ["ClientProjectMap"],
    }),
    getAssignedClients: builder.query({
      query: () => ({
        url: `/project/client-project-map/assigned`,
        method: "GET",
      }),
      providesTags: ["ClientProjectMap"],
    }),
  }),
});

export const {
  useAssignCoordinatorMutation,
  useGetClientProjectMapByClientIdQuery,
  useGetAssignedClientsQuery,
} = ClientProjectMapApi;

