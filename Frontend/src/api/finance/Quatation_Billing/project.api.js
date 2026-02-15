import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const financeprojectApi = createApi({
  reducerPath: "financeprojectApi",  // ✅ unique reducerPath
  baseQuery: axiosBaseQuery({ baseUrl: "/projects" }),
  tagTypes: ["Project"],

  endpoints: (builder) => ({
    // GET All Projects
    getProjects: builder.query({
      query: () => ({ url: "/get", method: "GET" }),
      transformResponse: (response) => response.projects,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Project", id: _id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    // GET Project by ID
    getProjectById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    // CREATE Project
    createProject: builder.mutation({
      query: (newProject) => ({ url: "/post", method: "POST", data: newProject }),
      invalidatesTags: [{ type: "Project", id: "LIST" }], // ✅ LIST tag for cache refresh
    }),

    // UPDATE Project
    updateProject: builder.mutation({
      query: ({ id, ...updateData }) => ({ url: `/${id}`, method: "PUT", data: updateData }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },        // ✅ refresh this project
        { type: "Project", id: "LIST" } // ✅ refresh project list
      ],
    }),

    // DELETE Project
    deleteProject: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Project", id: "LIST" }], // ✅ refresh list
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = financeprojectApi;
