import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const flagRaiseApi = createApi({
  reducerPath: "flagRaiseApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Flag", "FlagList", "ProjectFlags"],
  endpoints: (builder) => ({
    // ✅ Create Flag Raise
    createFlagRaise: builder.mutation({
      query: (body) => {
        console.log("🚀 Creating Flag:", body);

        return {
          url: "/admin/flag-raise",
          method: "POST",
          data: body,
        };
      },
      invalidatesTags: ["FlagList"],
      transformResponse: (response) => {
        console.log("✅ Create Flag Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Create Flag Error:", error);
        return error;
      },
    }),

    // ✅ Get Flag by ID
    getFlagById: builder.query({
      query: (flagId) => {
        console.log("📌 Fetching Flag by ID:", flagId);

        return {
          url: `/flags/${flagId}`,
          method: "GET",
        };
      },
      providesTags: (result, error, flagId) => [{ type: "Flag", id: flagId }],
    }),

    // ✅ Update Flag Status
    updateFlagStatus: builder.mutation({
      query: ({ flagId, body }) => {
        console.log("🔄 Updating Flag Status:", { flagId, body });

        return {
          url: `/flags/${flagId}/status`,
          method: "PATCH",
          data: body,
        };
      },
      invalidatesTags: (result, error, { flagId }) => [
        { type: "Flag", id: flagId },
        "FlagList",
      ],
      transformResponse: (response) => {
        console.log("✅ Update Status Response:", response);
        return response;
      },
      transformErrorResponse: (error) => {
        console.error("❌ Update Status Error:", error);
        return error;
      },
    }),

    // ✅ Get Flags by Project (with filters)
    getFlagsByProject: builder.query({
      query: ({ projectId, params }) => {
        console.log("📊 Fetching Flags by Project:", projectId, params);

        return {
          url: `/flags/project/${projectId}`,
          method: "GET",
          params, // status, type, priority
        };
      },
      providesTags: ["ProjectFlags"],
    }),

    // ✅ Get All Flags (with filters)
    getAllFlags: builder.query({
      query: (params) => {
        console.log("📋 Fetching All Flags:", params);

        return {
          url: "/flags",
          method: "GET",
          params, // status, departmentId, priority
        };
      },
      providesTags: ["FlagList"],
    }),
  }),
});

export const {
  useCreateFlagRaiseMutation,
  useGetFlagByIdQuery,
  useUpdateFlagStatusMutation,
  useGetFlagsByProjectQuery,
  useGetAllFlagsQuery,
} = flagRaiseApi;
