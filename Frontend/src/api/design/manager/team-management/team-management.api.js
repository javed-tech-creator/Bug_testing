import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const TeamExecutivesApi = createApi({
  reducerPath: "TeamExecutivesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["TeamExecutives"],

  endpoints: (builder) => ({
    getAllTeamExecutives: builder.query({
      query: ({ page, limit, search } = {}) => ({
        url: "design/team-executives",
        method: "GET",
        params: { page, limit, search },
      }),
      providesTags: ["TeamExecutives"],
    }),
  }),
});

export const {
  useGetAllTeamExecutivesQuery,
} = TeamExecutivesApi;
