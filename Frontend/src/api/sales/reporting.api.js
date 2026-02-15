import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const reportingApi = createApi({
  reducerPath: "reportingApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["report"],
  endpoints: (builder) => ({
    addReporting: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/sales/tl-report/create/${id}`,
        method: "POST",
        data: formData,
      }),
    }),
    getTodayReportById: builder.query({
      query: ({ id }) => ({
        url: `/sales/employee-report/get/today/${id}`,
        method: "GET",
      }),
      tagTypes: ["report"],
    }),
    addMorningReport: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/reporting/morning`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["report"],
    }),
    addEveningReport: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/reporting/evening`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["report"],
    }),
    getTodayReport: builder.query({
      query: ({ type }) => ({
        url: `/sales/reporting/today?type=${type}`,
        method: "GET",
      }),
      tagTypes: ["report"],
    }),
    getTeamReportingStatus: builder.query({
      query: ({ date }) => ({
        url: `/sales/reporting/team/status?date=${date}`,
        method: "GET",
      }),
      tagTypes: ["report"],
    }),
    submitManagerReport: builder.mutation({
      query: ({ formData, reportType }) => ({
        url: `/sales/reporting/manager?reportType=${reportType}`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["report"],
    }),
  }),
});
export const {
  useAddReportingMutation,
  useGetTodayReportByIdQuery,
  useAddMorningReportMutation,
  useAddEveningReportMutation,
  useGetTodayReportQuery,
  useGetTeamReportingStatusQuery,
  useSubmitManagerReportMutation,
} = reportingApi;
