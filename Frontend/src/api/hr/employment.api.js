import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const EmploymentApi = createApi({
  reducerPath: "EmploymentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Z", "S", "C", "B", "Dep", "Des", "SOP"],

  endpoints: (builder) => ({
    // Zone
    getZones: builder.query({
      query: () => ({
        url: "/hr/zone",
        method: "GET",
      }),
      providesTags: ["Z"],
    }),

    // States by Zone
    getStatesByZone: builder.query({
      query: (zoneId) => ({
        url: `/hr/state/zone/${zoneId}`,
        method: "GET",
      }),
      providesTags: ["S"],
    }),

    // Cities by State
    getCitiesByState: builder.query({
      query: (stateId) => ({
        url: `/hr/city/state/${stateId}`,
        method: "GET",
      }),
      providesTags: ["C"],
    }),

    // Branches by City
    getBranchesByCity: builder.query({
      query: (cityId) => ({
        url: `/hr/branch/city/${cityId}`,
        method: "GET",
      }),
      providesTags: ["B"],
    }),

    // Departments by Branch
    getDepartmentByBranch: builder.query({
      query: (branchId) => ({
        url: `/hr/department/branch/${branchId}`,
        method: "GET",
      }),
      providesTags: ["Dep"],
    }),

    // Designations by Department
    getDesignationsByDepId: builder.query({
      query: (depId) => ({
        url: `/hr/designation/department/${depId}`,
        method: "GET",
      }),
      providesTags: ["Des"],
    }),

    // SOP APIs
    getAllSops: builder.query({
      query: () => ({
        url: "/hr/sop",
        method: "GET",
      }),
      providesTags: ["SOP"],
    }),

    getSopById: builder.query({
      query: (id) => ({
        url: `/hr/sop/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "SOP", id }],
    }),

    createSop: builder.mutation({
      query: (body) => ({
        url: "/hr/sop",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["SOP"],
    }),

    updateSop: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hr/sop/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SOP", id }, "SOP"],
    }),

    // ✅ DELETE existing file from SOP (this must be inside endpoints)
    deleteSopFile: builder.mutation({
      query: ({ sopId, fileId }) => ({
        url: `/hr/sop/${sopId}/file/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SOP"],
    }),
  }),
});

export const {
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
  useGetBranchesByCityQuery,
  useGetDepartmentByBranchQuery,
  useGetDesignationsByDepIdQuery,
  useGetAllSopsQuery,
  useCreateSopMutation,
  useGetSopByIdQuery,
  useUpdateSopMutation,
  useDeleteSopFileMutation,
} = EmploymentApi;
