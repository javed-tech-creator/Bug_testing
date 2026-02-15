import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";
import { update } from "lodash";

export const targetApi = createApi({
  reducerPath: "target",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["target"],
  endpoints: (builder) => ({
    getEmployeByDepartment: builder.query({
      query: ({ deptId }) => ({
        url: `/hr/user/query?departmentId=${deptId}&type=EMPLOYEE`,
        method: "GET",
      }),
    }),
    assignTarget: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/target/assign`,
        method: "POST",
        data: formData,
      }),
    }),
    targetByExecutiveId: builder.query({
      query: ({ query }) => ({
        url: `/sales/target/details?${query}`,
        method: "GET",
      }),
    }),
    targetByDeparmentId: builder.query({
      query: ({ query }) => ({
        url: `/sales/target/department?${query}`,
        method: "GET",
      }),
    }),
    saveTargetSlot: builder.mutation({
      query: ({ formData }) => ({
        url: `/sales/target/slot`,
        method: "POST",
        data: formData,
      }),
    }),
    updateTargetSlot: builder.mutation({
      query: ({ slotId, formData }) => ({
        url: `/sales/target/slot/${slotId}`,
        method: "PUT",
        data: formData,
      }),
    }),
    summaryData: builder.query({
      query: ({ query }) => ({
        url: `/sales/target/summary?${query}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetEmployeByDepartmentQuery,
  useAssignTargetMutation,
  useTargetByExecutiveIdQuery,
  useTargetByDeparmentIdQuery,
  useSaveTargetSlotMutation,
  useUpdateTargetSlotMutation,
  useSummaryDataQuery,
} = targetApi;
