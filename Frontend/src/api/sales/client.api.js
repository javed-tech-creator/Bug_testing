import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const clientApi = createApi({
  reducerPath: "client",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["client","Project","quotation"],
  endpoints: (builder) => ({
    createClient: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/client`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["lead"],
    }),
    getClient: builder.query({
      query: ({ id }) => ({
        url: `/sales/client`,
        method: "GET",
      }),
    }),
    getClientById: builder.query({
      query: ({ id }) => ({
        url: `/sales/client/${id}`,
        method: "GET",
      }),
    }),
    getClientByParams:builder.query({
      query:({params})=>({
        url:`/sales/client?${params}`,
        method:"GET"
      })
    }),
    updateClient: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/sales/client/${id}`,
        method: "PUT",
        data: formData,
      }),
    }),
    createProject: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/project`,
        method: "POST",
        data: formData,
      }),
    }),
    updateProject: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/sales/project/${id}`,
        method: "PUT",
        data: formData,
      }),
    }),
    getProject: builder.mutation({
      query: ({ id }) => ({
        url: `/sales/project/${id}`,
        method: "GET",
      }),
    }),
    getProjectsByClient: builder.query({
      query: ({ clientId }) => ({
        url: `/sales/project?clientId=${clientId}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
    getProjectsById: builder.query({
      query: ({ id }) => ({
        url: `/sales/project/${id}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
    addQuotation: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/client-quotation`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["quotation"],
    }),
    updateQuotation: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/sales/client-quotation/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["quotation"],
    }),
    sendQuotationToClient: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/sales/client-quotation/send/${id}`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["quotation"],
    }),
    getQuotationById: builder.query({
      query: ({ id }) => ({
        url: `/sales/client-quotation/${id}`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    getQuotationByProjectId: builder.query({
      query: ({ id }) => ({
        url: `/sales/client-quotation/project/${id}`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),
    sendToManager: builder.mutation({
      query: ({ clientId }) => ({
        url: `/sales/client-mapping/send-to-manager`,
        method: "POST",
        data: { clientId },
      }),
      invalidatesTags: ["client"],
    }),
    sendToProjectDepartment: builder.mutation({
      query: ({ clientId }) => ({
        url: `/sales/client-mapping/send-to-project-department`,
        method: "POST",
        data: { clientId },
      }),
      invalidatesTags: ["client"],
    }),
  }),
});

export const {
  useLazyGetClientQuery,
  useGetClientByParamsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useGetClientByIdQuery,
  useSendToManagerMutation,
  useSendToProjectDepartmentMutation,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetProjectMutation,
  useGetProjectsByClientQuery,
  useGetProjectsByIdQuery,
  useAddQuotationMutation,
  useUpdateQuotationMutation,
  useSendQuotationToClientMutation,
  useGetQuotationByIdQuery,
  useGetQuotationByProjectIdQuery,
} = clientApi;
