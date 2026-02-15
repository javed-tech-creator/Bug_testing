import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const attendanceApi = createApi({
  reducerPath: "attendanceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Attendance", "Calendar"],
  endpoints: (builder) => ({
    /** ----------------------------
     * ➤ EMPLOYEE CHECK-IN (LOGIN)
     * -----------------------------*/
    employeeCheckIn: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/hr/attendance/login/${id}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ EMPLOYEE CHECK-OUT (LOGOUT)
     * -----------------------------*/
    employeeCheckOut: builder.mutation({
      query: ({ id }) => ({
        url: `/hr/attendance/logout/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ MARK ABSENT
     * -----------------------------*/
    employeeAbsent: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/hr/attendance/absent/${id}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ GET SINGLE EMPLOYEE ATTENDANCE
     * Backend route → GET /attendance/:id
     * -----------------------------*/
    getEmployeeAttendance: builder.query({
      query: (id) => ({
        url: `/hr/attendance/${id}`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ GET ALL ATTENDANCE
     * Backend route → GET /attendance
     * -----------------------------*/
    getAllAttendance: builder.query({
      query: () => ({
        url: `/hr/attendance/all`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ MONTHLY ATTENDANCE CHART
     * Backend route → GET /attendance/chart?id=&month=
     * -----------------------------*/
    getMonthlyChart: builder.query({
      query: ({ id, month }) => ({
        url: `/hr/attendance/chart?id=${id}&month=${month}`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ CALENDAR VIEW
     * Backend route → GET /attendance/calendar?month=&year=
     * -----------------------------*/
    getCalendarView: builder.query({
      query: ({ month, year }) => ({
        url: `/hr/attendance/calendar?month=${month}&year=${year}`,
        method: "GET",
      }),
      providesTags: ["Calendar"],
    }),

    /** ----------------------------
     * ➤ WEEKLY ATTENDANCE CHART
     * Backend route → GET /attendance/weekly/:id
     * -----------------------------*/
    getWeeklyChart: builder.query({
      query: (id) => ({
        url: `/hr/attendance/weekly/${id}`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ FILTER ATTENDANCE
     * Backend route → GET /attendance/filter
     * -----------------------------*/
    attendanceFilter: builder.query({
      query: (queryString = "") => ({
        url: `/hr/attendance/filter?${queryString}`,
        method: "GET",
      }),
      providesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ UPDATE ATTENDANCE (PATCH)
     * Backend route → PATCH /attendance/update
     * -----------------------------*/
    updateAttendance: builder.mutation({
      query: (payload) => ({
        url: `/hr/attendance/update`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["Attendance", "Calendar"],
    }),

    /** ----------------------------
     * ➤ GET ATTENDANCE BY SPECIFIC DATE
     * Backend route → GET /attendance/by-date?date=
     * -----------------------------*/
    getAttendanceByDate: builder.query({
      query: (date) => ({
        url: `/hr/attendance/by-date?date=${date}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Attendance"],
    }),

    /** ----------------------------
     * ➤ GET ATTENDANCE BY HR CITY
     * Backend route → GET /attendance/by-city
     * -----------------------------*/
    getAttendanceByCity: builder.query({
      query: ({ date }) => {
        let url = `/hr/attendance/by-city`;
        if (date) {
          url += `?date=${date}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Attendance"],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useEmployeeCheckInMutation,
  useEmployeeCheckOutMutation,
  useEmployeeAbsentMutation,
  useGetEmployeeAttendanceQuery,
  useGetAllAttendanceQuery,
  useGetMonthlyChartQuery,
  useGetCalendarViewQuery,
  useGetWeeklyChartQuery,
  useAttendanceFilterQuery,
  useUpdateAttendanceMutation,
  useGetAttendanceByDateQuery,
  useGetAttendanceByCityQuery,
} = attendanceApi;
