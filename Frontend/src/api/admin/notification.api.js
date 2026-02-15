import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["notification"],
  endpoints: (builder) => ({
    getUserNotifications: builder.query({
      query: ({ userId }) => ({
        url: `notification/user/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserNotificationsQuery } = notificationApi;
