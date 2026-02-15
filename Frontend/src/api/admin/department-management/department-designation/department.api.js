import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const DepartmentApi = createApi({
  reducerPath: "DepartmentApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Department", "Designation","ActionGroup"],

  endpoints: (builder) => ({
    // ================= department API Start=================
    getDepartments: builder.query({
      query: () => ({
        url: "/hr/department",
        method: "GET",
      }),
      providesTags: ["Department"],
    }),

    createDepartment: builder.mutation({
      query: (data) => ({
        url: "/hr/department",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hr/department/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Department"],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/hr/department/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),

    // get branch by city id
    getDepartmentByBranch: builder.query({
      query: (branchId) => ({
        url: `/hr/department/branch/${branchId}`,
        method: "GET",
      }),
    }),

    // ================= department API End=================

    // ================= designation API Start=================
    getDesignations: builder.query({
      query: () => ({
        url: "/hr/designation",
        method: "Get",
      }),
      providesTags: ["Designation"],
    }),

    createDesignation: builder.mutation({
      query: (data) => ({
        url: "/hr/designation",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["Designation"],
    }),

    updateDesignation: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hr/designation/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["Designation"],
    }),
    deleteDesignation: builder.mutation({
      query: (id) => ({
        url: `/hr/designation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Designation"],
    }),

        // GET Designations by Department ID
    getDesignationsByDepId: builder.query({
      query: (depId) => ({
        url: `hr/designation/department/${depId}`,
        method: "GET",
      }),
    }),
    // ================= designation API End=================

    // ================= Actiongroup API Start=================
    //  GET /hr/action-group
    getActionGroups: builder.query({
      query: () => ({
        url: "hr/action-group",
        method: "GET",
      }),
      providesTags: ["ActionGroup"],
    }),

        //  POST: Create new action group
    createActionGroup: builder.mutation({
      query: (newData) => ({
        url: "hr/action-group",
        method: "POST",
        data: newData,
      }),
      invalidatesTags: ["ActionGroup"],
    }),

    // PUT: Update existing action group
    updateActionGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `hr/action-group/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["ActionGroup"],
    }),

    //  DELETE: Remove action group
    deleteActionGroup: builder.mutation({
      query: (id) => ({
        url: `hr/action-group/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ActionGroup"],
    }),

       getActionsGroupByDep: builder.query({
      query: (depId) => ({
        url: `/hr/action-group/department/${depId}`,
        method: "GET",
      }),
    }), 

    // ================= Action Group API End=================
  }),
});

export const {
  // Department hooks
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentByBranchQuery,

  // Designation hooks
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useGetDesignationsByDepIdQuery,

  //Action Group
  useGetActionGroupsQuery,
  useCreateActionGroupMutation,
  useUpdateActionGroupMutation,
  useDeleteActionGroupMutation,
  useGetActionsGroupByDepQuery,
} = DepartmentApi;
