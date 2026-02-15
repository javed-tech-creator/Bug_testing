import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const UserManagementApi = createApi({
  reducerPath: "UserManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UserManagement"],

  endpoints: (builder) => ({
    // GET employee profile
    getEmployeeProfile: builder.query({
      query: () => ({
        url: "/hr/employee-profile",
        method: "GET",
      }),
    }),

    getRegisteredUsers: builder.query({
      query: () => ({
        url: "/hr/user",
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),

    // GET user by ID (Lazy query support)
    getRegisteredUsersById: builder.query({
      query: (userId) => ({
        url: `/hr/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),

    // POST register new user
    registerUser: builder.mutation({
      query: (data) => ({
        url: "hr/user/register",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["UserManagement"],
    }),

    //update user
    updateRegisteredUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/hr/user/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["UserManagement"],
    }),

    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `hr/user/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["UserManagement"],
    }),

    getUsersByDesignationId: builder.query({
      query: (designation) => ({
        url: `/hr/user/query?designationId=${designation}`,
        method: "GET",
      }),
      // providesTags: ["UserManagement"],
    }),
  }),
});

export const {
  useGetEmployeeProfileQuery,
  useLazyGetEmployeeProfileQuery,
  useGetRegisteredUsersQuery,
  useLazyGetRegisteredUsersByIdQuery, //  Lazy version export
  useUpdateRegisteredUserMutation,
  useUpdateUserStatusMutation,
  useRegisterUserMutation,
  useGetUsersByDesignationIdQuery,
} = UserManagementApi;
