import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const MasterApi = createApi({
  reducerPath: "MasterApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Zone", "State", "City","Branch"],

  endpoints: (builder) => ({
    // ================= Zone API =================

    //  Get All Zones
    getZones: builder.query({
      query: () => ({
        url: "/hr/zone",
        method: "GET",
      }),
      providesTags: ["Zone"],
    }),

    //  Add New Zone
    addZone: builder.mutation({
      query: (data) => ({
        url: "/hr/zone",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Zone"],
    }),

    //  Update Zone
    updateZone: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hr/zone/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Zone"],
    }),

    deleteZone: builder.mutation({
      query: (id) => ({
        url: `/hr/zone/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Zone"],
    }),

    // Zone api End

    // ================= State API =================
    //  Get All States
    getStates: builder.query({
      query: () => ({
        url: "/hr/state",
        method: "GET",
      }),
      providesTags: ["State"],
    }),

    //  Add New State
    addState: builder.mutation({
      query: (data) => ({
        url: "/hr/state",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["State"],
    }),

    //  Update State
    updateState: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hr/state/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["State"],
    }),

    deleteState: builder.mutation({
      query: (id) => ({
        url: `/hr/state/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["State"],
    }),

       // Get states by zone ID
getStatesByZone: builder.query({
  query: (zoneId) => ({
    url: `/hr/state/zone/${zoneId}`,
    method: "GET", // explicitly GET define kiya
  }),
}),
    // state api end


    // ================= City API =================
    getCities: builder.query({
      query: () => ({ url: "/hr/city", method: "GET" }),
      providesTags: ["City"],
    }),

    addCity: builder.mutation({
      query: (data) => ({ url: "/hr/city", method: "POST", data }),
      invalidatesTags: ["City"],
    }),

    updateCity: builder.mutation({
      query: ({ id, data }) => ({ url: `/hr/city/${id}`, method: "PUT", data }),
      invalidatesTags: ["City"],
    }),

    deleteCity: builder.mutation({
      query: (id) => ({ url: `/hr/city/${id}`, method: "DELETE" }),
      invalidatesTags: ["City"],
    }),

        // Get cities by state ID
 getCitiesByState: builder.query({
  query: (stateId) => ({
    url: `/hr/city/state/${stateId}`,
    method: "GET",
  }),
}),
    // City api End

    // ================= Branch API =================

    //get all branch
    getBranches: builder.query({
      query: () => ({url:'/hr/branch', method:'GET'}),
      providesTags: ['Branch'],
    }),

    // CREATE a new branch
    createBranch: builder.mutation({
      query: (branchData) => ({
        url: '/hr/branch',
        method: 'POST',
        data: branchData,
      }),
      invalidatesTags: ['Branch'],
    }),

    // UPDATE a branch
    updateBranch: builder.mutation({
      query: ({ id, ...branchData }) => ({
        url: `/hr/branch/${id}`,
        method: 'PUT',
        data: branchData,
      }),
      invalidatesTags: ['Branch'],
    }),

    // DELETE a branch
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/hr/branch/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Branch'],
    }),

    // get branch by city id
     getBranchesByCity: builder.query({
  query: (cityId) => ({
    url: `/hr/branch/city/${cityId}`,
    method: "GET",
  }),
}),

  }),
});

export const {
 // Zone Hooks
  useGetZonesQuery,
  useAddZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,

  // State Hooks
  useGetStatesQuery,
  useAddStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
 useGetStatesByZoneQuery,

  // City Hooks
  useGetCitiesQuery,
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetCitiesByStateQuery,

  // Branch Hooks
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
useGetBranchesByCityQuery,
} = MasterApi;
