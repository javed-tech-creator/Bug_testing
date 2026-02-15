import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

export const vendorNotificationApi = createApi({

  reducerPath: "notificationApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Notification"],
  endpoints: (builder) => ({

    // ✅ Get notifications
    getNotifications: builder.query({
      query: () => ({
        url: "/vendor/get-all-notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    // ✅ Mark all notifications as read
    markAllRead: builder.mutation({
      query: () => ({
        url: "/vendor/read-all-notifications",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

      markRead: builder.mutation({
  query: (id) => ({
    url: `/vendor/read-notifications/${id}`,
    method: "PATCH",
  }),
  invalidatesTags: ["Notification"],
}),

  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} = vendorNotificationApi;
