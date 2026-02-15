import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/clients" }), 
  tagTypes: ["Client"],

  endpoints: (builder) => ({
    // GET All Clients
    getClients: builder.query({
      query: () => ({
        url: "/get",
        method: "GET",
      }),
      providesTags: ["Client"],
    }),

    // GET Client by ID
    getClientById: builder.query({
      query: (id) => ({
        url: `/get/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Client", id }],
    }),

    // CREATE Client
    createClient: builder.mutation({
      query: (newClient) => ({
        url: "/post",
        method: "POST",
        data: newClient,
      }),
      invalidatesTags: ["Client"],
    }),

    // UPDATE Client
    updateClient: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/${id}`,
        method: "PUT",
        data: updateData,
      }),
      invalidatesTags:["Client"]
    }),

    // DELETE Client
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
