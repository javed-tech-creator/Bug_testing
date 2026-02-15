import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["auth"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({formData}) => ({
        url: `/login/email/password`,
        method: "POST",
        data: formData,
      }),
    }),
    authLogin: builder.mutation({
      query: ({formData}) => ({
        url: `/hr/user/login`,
        method: "POST",
        data: formData,
      }),
    }),
})
})
export const {
useLoginMutation,
useAuthLoginMutation
} = authApi;
