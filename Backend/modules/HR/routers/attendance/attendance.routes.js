// routes/attendance/attendance.routes.js
console.log("HR Attendance Router LOADED");
console.log("Attendance routes prefix: /hr/attendance");
import express from "express";
import {
  attendanceLogin,
  attendanceLogout,
  absent,
  employeeAttendance,
  allEmployeeAttendance,
  getChartAttendance,
  calendarView,
  getWeeklyAttendanceChart,
  attendanceFilter,
  attendanceUpdate,
  getAttendanceByDateSecond,
  getAttendanceByCity,
} from "../../controllers/attendance/attendance.controller.js";

const router = express.Router();

// Employee Login (Check-In)
router.post("/login/:id", attendanceLogin);

// Employee Logout (Check-Out)
router.post("/logout/:id", attendanceLogout);

// Filter
router.get("/filter", attendanceFilter);

// Mark Employee Absent
router.post("/absent/:id", absent);

// Get Single Employee Attendance
router.get("/employee/:id", employeeAttendance);

// Get All Employees Attendance
router.get("/all", allEmployeeAttendance);

// Monthly Attendance Chart
router.get("/chart", getChartAttendance);

// Calendar View (All Employees, Month Wise)
router.get("/calendar", calendarView);

// Weekly Attendance Chart (Single Employee)
router.get("/weekly/:id", getWeeklyAttendanceChart);

// Update Attendance Status (New API)
router.patch("/update", attendanceUpdate);

// Get Attendance By Specific Date (All Employees)
router.get("/by-date", getAttendanceByDateSecond);

router.get("/by-city", getAttendanceByCity);

export default router;
