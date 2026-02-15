
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const dashboardTechApi = createApi({
  reducerPath: "dashboardTechApi",
  baseQuery: axiosBaseQuery(),

    tagTypes: ["DashboardSummary", "AssetsDistribution", "TicketsByDepartment","ExpiryNotification"],

  endpoints: (builder) => ({

 //  Dashboard Summary
    getDashboardSummary: builder.query({
      query: () =>({
        url: "/tech/dashboard/summary",
       method: "GET",
       }),
        providesTags: ["DashboardSummary"], //  Tag add kiya
    }),

    //  Assets Distribution
    getAssetsDistribution: builder.query({
      query: () =>({
        url: "/tech/dashboard/assets-distribution",
       method: "GET",
        }),
              providesTags: ["AssetsDistribution"], //  Tag add kiya

    }),

    //  Tickets by Department
    getTicketsByDepartment: builder.query({
      query: () =>({
        url: "/tech/dashboard/tickets-by-department",
       method: "GET",
        }),
              providesTags: ["TicketsByDepartment"], //  Tag add kiya

    }),

        getExpiryNotifications: builder.query({
      query: () =>({
        url: "/tech/dashboard/expiry-notifications",
       method: "GET",
        }),
              providesTags: ["ExpiryNotification"], //  Tag add kiya

    }),

       getEmployeeData: builder.query({
      query: () =>({
        url: "/tech/dashboard/employee-data",
       method: "GET",
        }),
    }),


  }),
});

export const {
 useGetDashboardSummaryQuery,
  useGetAssetsDistributionQuery,
  useGetTicketsByDepartmentQuery,
  useGetExpiryNotificationsQuery,
  useGetEmployeeDataQuery,
} = dashboardTechApi;
