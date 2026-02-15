// controllers/attendance/attendance.controller.js
import Attendance from "../../models/attendance/attendance.model.js";
import EmployeeProfile from "../../models/onboarding/employeeProfile.model.js";
import Leave from "../../models/leave/leave.model.js";
import moment from "moment";
import ApiError from "../../../../utils/master/ApiError.js";
import mongoose from "mongoose";

/**
 * @route POST /attendance/login/:id
 * @desc Marks employee check-in (Testing Mode Enabled)
 * @access Private
 */
const attendanceLogin = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("[ATTENDANCE] Login API called for:", id);
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return next(new ApiError(400, "Location is required"));
    }

    const validEmployee = await EmployeeProfile.findById(id);
    if (!validEmployee) {
      return next(new ApiError(400, "Employee is not valid"));
    }

    // Use server time as canonical "now" and also compute IST representation for logs
    const now = new Date();
    // create a Date object that reflects IST by parsing the locale string in Asia/Kolkata
    const nowIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // day bounds based on nowIST
    const startOfDay = new Date(nowIST);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(nowIST);
    endOfDay.setHours(23, 59, 59, 999);

    // time constraints (9:00 - 17:00) based on nowIST
    const nineAM = new Date(nowIST);
    nineAM.setHours(9, 0, 0, 0);

    const elevenAM = new Date(nowIST);
    elevenAM.setHours(11, 0, 0, 0);

    const fivePM = new Date(nowIST);
    fivePM.setHours(17, 0, 0, 0);

    // NOTE: Testing mode – time checks are commented out in original. Keeping same behavior:
    // (uncomment the following lines to enable time restriction)
    // if (nowIST < nineAM) return next(new ApiError(400, "You are checking in too early. Check-in starts at 9:00 AM"));
    // if (nowIST > fivePM) return next(new ApiError(400, "Check-in time is over for today (ends at 5:00 PM)"));

    // Check approved leave for today (compare using server now to leave date window)
    const leaveData = await Leave.find({ employeeId: validEmployee._id });

    const todayLeave = leaveData.some((leave) => {
      const leaveStartDate = new Date(leave.startDate);
      const leaveEndDate = new Date(leave.endDate);

      leaveStartDate.setHours(0, 0, 0, 0);
      leaveEndDate.setHours(23, 59, 59, 999);

      return (
        leave.status === "Approved" &&
        now >= leaveStartDate &&
        now <= leaveEndDate
      );
    });

    if (todayLeave) {
      return next(new ApiError(400, "You have an approved leave today"));
    }

    let isFullDay = false;
    let isHalfDay = false;

    // Determine full/half day based on IST time
    if (nowIST >= nineAM && nowIST <= elevenAM) {
      isFullDay = true;
      console.log("Full Day Attendance");
    } else if (nowIST > elevenAM && nowIST <= fivePM) {
      isHalfDay = true;
      console.log("Half Day Attendance");
    } else {
      console.log(
        "Late check-in / outside normal window - marking as Half Day"
      );
      isHalfDay = true;
    }

    const addEmployee = await Attendance.create({
      employeeId: validEmployee._id,
      loginTime: now,
      date: now,
      status: "present",
      isFullDay,
      isHalfDay,
      checkIn: true,
      location: {
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        type: "Point",
      },
    });

    const result = {
      _id: addEmployee._id,
      employeeId: addEmployee.employeeId,
      loginTime: addEmployee.loginTime,
      loginTimeIST: nowIST.toLocaleString(),
      status: addEmployee.status,
      isFullDay: addEmployee.isFullDay,
      isHalfDay: addEmployee.isHalfDay,
      currentTime: now.toLocaleString(),
      currentTimeIST: nowIST.toLocaleString(),
    };

    console.log("[ATTENDANCE] Login success:", addEmployee._id);
    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: result,
    });
  } catch (error) {
    console.error("Attendance Login Error:", error);
    return next(new ApiError(500, error?.message || "Internal Server Error"));
  }
};

/**
 * @route POST /attendance/logout/:id
 * @desc Marks employee logout (Testing Mode Enabled - allows multiple logouts)
 * @access Private
 */
const attendanceLogout = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("[ATTENDANCE] Logout API called for:", id);
    const validEmployee = await EmployeeProfile.findById(id);

    if (!validEmployee) {
      return next(new ApiError(400, "Employee is not valid"));
    }

    const now = new Date(); // canonical now

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.findOne({
      employeeId: validEmployee._id,
      date: { $gte: todayStart, $lte: todayEnd },
    }).sort({ loginTime: -1 }); // latest check-in

    if (!todayAttendance) {
      return next(new ApiError(400, "No attendance record found for today"));
    }

    // Testing mode: always allow logout
    todayAttendance.logoutTime = now;

    const login = new Date(todayAttendance.loginTime);
    const diffMs = Math.abs(now - login);

    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

    todayAttendance.workingHours = `${diffHrs}h ${diffMins}m ${diffSecs}s`;

    const standardMs = 9 * 60 * 60 * 1000;
    if (diffMs > standardMs) {
      const otMs = diffMs - standardMs;
      const otHrs = Math.floor(otMs / (1000 * 60 * 60));
      const otMins = Math.floor((otMs % (1000 * 60 * 60)) / (1000 * 60));
      const otSecs = Math.floor((otMs % (1000 * 60)) / 1000);
      todayAttendance.otTime = `${otHrs}h ${otMins}m ${otSecs}s`;
    } else {
      todayAttendance.otTime = `0h 0m 0s`;
    }

    await todayAttendance.save();

    const io = req.app.get("io");
    const message = `${validEmployee.name} has successfully checked out.`;
    if (io) {
      io.emit("new-message", message);
    }

    console.log("[ATTENDANCE] Logout success:", todayAttendance._id);
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
      data: todayAttendance,
    });
  } catch (error) {
    console.error("Attendance Logout Error:", error);
    return next(new ApiError(500, error?.message || "Internal Server Error"));
  }
};

const hasLeaveOnDate = async (employeeId, date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const leave = await Leave.findOne({
    employeeId,
    startDate: { $lte: end },
    endDate: { $gte: start },
    status: { $in: ["Pending", "Approved"] },
  });

  return leave ? true : false;
};

const absent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validEmployee = await EmployeeProfile.findById(id);
    if (!validEmployee) {
      return next(new ApiError(404, "Employee not valid"));
    }

    const today = new Date();

    const hasLeave = await hasLeaveOnDate(id, today);

    const result = await Attendance.create({
      employeeId: id,
      status: hasLeave ? "L" : "A",
      leave: hasLeave ? true : false,
      remark: hasLeave ? "Auto Converted From Absent (Leave Applied)" : null,
      date: today,
    });

    return res.status(200).json({
      success: true,
      message: hasLeave
        ? "Employee had leave — Absent converted to Leave"
        : "Absent recorded successfully",
      data: result,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

/**
 * @route GET /attendance/employee/:id
 * @desc Fetch single employee latest attendance
 * @access Private
 */
const employeeAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("[ATTENDANCE] Fetch single attendance for:", id);
    const result = await Attendance.findOne({ employeeId: id })
      .sort({ createdAt: -1 })
      .populate({
        path: "employeeId",
        select: "-__v",
        populate: [
          { path: "branchId", select: "name" },
          { path: "departmentId", select: "name" },
          { path: "designationId", select: "title" },
          { path: "zoneId", select: "name" },
          { path: "stateId", select: "name" },
          { path: "city", select: "name" },
        ],
      });

    if (!result) {
      return next(new ApiError(404, "Attendance not found"));
    }
    console.log("[ATTENDANCE] Single attendance fetched:", result._id);
    return res.status(200).json({
      success: true,
      message: "Employee attendance fetched",
      data: result,
    });
  } catch (err) {
    console.error("Employee Attendance Error:", err);
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

/**
 * @route GET /attendance/all
 * @desc Fetch all employees attendance
 * @access Private
 */
const allEmployeeAttendance = async (req, res, next) => {
  try {
    console.log("[ATTENDANCE] Fetch all attendance");
    const result = await Attendance.find()
      .populate({
        path: "employeeId",
        select: "name email phone photo city",
      })
      .lean();

    const formatted = result.map((att) => ({
      _id: att._id,
      name: att.employeeId?.name || "N/A",
      email: att.employeeId?.email || "N/A",
      phone: att.employeeId?.phone || "N/A",
      photo: att.employeeId?.photo || null,

      status: att.status || "N/A",
      checkIn: att.checkIn || false,
      leave: att.leave || false,
      workingHours: att.workingHours || "0h 0m 0s",
      loginTime: att.loginTime || null,
      logoutTime: att.logoutTime || null,
      date: att.date || null,
      location: att.location || null,
    }));

    return res.status(200).json({
      success: true,
      message: "All attendance fetched",
      data: formatted,
    });
  } catch (err) {
    console.error("All Employee Attendance Error:", err);
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

/**
 * @route GET /attendance/filter?startDate=&endDate=
 * @desc Filters attendance between startDate and endDate
 * @access Private
 */
const attendanceFilter = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("[ATTENDANCE] Filter API called:", startDate, endDate);

    if (!startDate || !endDate) {
      return next(new ApiError(400, "startDate and endDate are required"));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include full day

    const data = await Attendance.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $addFields: {
          employeeStatus: {
            $cond: [
              { $eq: ["$leave", true] },
              "L",
              {
                $cond: [
                  { $eq: ["$isFullDay", true] },
                  "P",
                  {
                    $cond: [
                      { $eq: ["$isHalfDay", true] },
                      "HL",
                      {
                        $cond: [
                          { $eq: ["$status", "WFH"] },
                          "WFH",
                          {
                            $cond: [
                              { $eq: ["$status", "WO"] },
                              "WO",
                              {
                                $cond: [{ $eq: ["$status", "H"] }, "H", "A"],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $project: {
          employeeId: 1,
          mpId: "$empId",
          date: 1,
          checkIn: "$loginTime",
          checkOutTime: "$logoutTime",
          workDuration: "$workingHours",
          status: "$employeeStatus",
          leave: 1,
          leaveReason: "$reasonForLeave",
          location: "$location",
          locationOut: 1,
          ipAddress: 1,
          deviceDetails: 1,
          remark: 1,
          createdAt: 1,
          updatedAt: 1,
          "employee.name": 1,
          "employee.email": 1,
          "employee.mobile": 1,
          "employee.empId": 1,
          projectName: "$projectName",
        },
      },
    ]);

    console.log("[ATTENDANCE] Filter results:", data.length);
    return res.status(200).json({ success: true, message: "success", data });
  } catch (err) {
    console.error("Attendance Filter Error:", err);
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

/**
 * @route GET /attendance/chart?id=&month=YYYY-MM
 * @desc Monthly attendance chart for employee
 * @access Private
 */
const getChartAttendance = async (req, res) => {
  try {
    const { id, month } = req.query;
    console.log("[ATTENDANCE] Monthly chart requested for:", id, month);

    if (!month) {
      return res
        .status(400)
        .json({ success: false, message: "month (YYYY-MM) is required" });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const allDays = [];
    for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
      allDays.push(new Date(d));
    }

    const attendanceData = await Attendance.find({
      employeeId: id,
      date: { $gte: startDate, $lt: endDate },
    });

    const chart = allDays.map((day) => {
      const found = attendanceData.find(
        (entry) => new Date(entry.date).toDateString() === day.toDateString()
      );
      return {
        date: day.toISOString().split("T")[0],
        status: found ? found.status : "Not Available",
      };
    });

    console.log("[ATTENDANCE] Monthly chart generated. Days:", chart.length);
    return res.status(200).json({ success: true, data: chart });
  } catch (err) {
    console.error("Get Chart Attendance Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

/**
 * @route GET /attendance/calendar?year=YYYY&month=MM
 * @desc Calendar-style attendance response (Year + Month)
 * @access Private
 */
const calendarView = async (req, res, next) => {
  try {
    const { year, month } = req.query; // year: YYYY, month: MM
    console.log("[ATTENDANCE] Calendar view requested:", year, month);

    if (!year || !month) {
      return next(
        new ApiError(400, "Year and month are required in YYYY and MM format")
      );
    }

    const startDate = moment(`${year}-${month}`, "YYYY-MM")
      .startOf("month")
      .toDate();
    const endDate = moment(`${year}-${month}`, "YYYY-MM")
      .endOf("month")
      .toDate();

    console.log(`📅 Calendar View Request: Year=${year}, Month=${month}`);
    console.log(`📅 Date Range: ${startDate} to ${endDate}`);

    const employees = await EmployeeProfile.find();
    const allAttendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const result = employees.map((emp) => {
      const attendanceMap = {};

      for (
        let day = moment(startDate);
        day <= moment(endDate);
        day.add(1, "days")
      ) {
        const currentDate = day.format("YYYY-MM-DD");

        const att = allAttendance.find((a) => {
          const attDate = moment(a.date).format("YYYY-MM-DD");
          return (
            a.employeeId.toString() === emp._id.toString() &&
            attDate === currentDate
          );
        });

        if (att) {
          if (att.leave || att.leaveSource) {
            attendanceMap[currentDate] = "L";
          } else if (att.isFullDay) {
            attendanceMap[currentDate] = "P";
          } else if (att.isHalfDay) {
            attendanceMap[currentDate] = "HD";
          } else if (att.status && att.status.toLowerCase() === "wfh") {
            attendanceMap[currentDate] = "WFH";
          } else if (att.status && att.status.toLowerCase() === "wo") {
            attendanceMap[currentDate] = "WO";
          } else if (att.status && att.status.toLowerCase() === "h") {
            attendanceMap[currentDate] = "H";
          } else {
            attendanceMap[currentDate] = "A";
          }
        } else {
          attendanceMap[currentDate] = "A";
        }
      }

      return {
        employeeId: emp._id,
        name: emp.name,
        email: emp.email,
        mobile: emp.mobile,
        attendance: attendanceMap,
      };
    });

    console.log("[ATTENDANCE] Calendar view generated");
    return res.status(200).json({
      success: true,
      message: "Calendar view generated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Calendar View Error:", err);
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

/**
 * @route GET /attendance/weekly/:id
 * @desc Weekly attendance chart for employee
 * @access Private
 */
const getWeeklyAttendanceChart = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("[ATTENDANCE] Weekly chart requested for:", id);
    const weeklyData = [];
    // use ISO week starting Monday
    const weekStart = moment().startOf("isoWeek");

    for (let i = 0; i < 7; i++) {
      const date = moment(weekStart).add(i, "days");
      const start = date.startOf("day").toDate();
      const end = date.endOf("day").toDate();
      const attendance = await Attendance.findOne({
        employeeId: id,
        createdAt: { $gte: start, $lte: end },
      });

      const isPresent =
        attendance && (attendance.isFullDay || attendance.isHalfDay);
      weeklyData.push({
        name: date.format("ddd"),
        present: isPresent ? 1 : 0,
        absent: isPresent ? 0 : 1,
      });
    }

    console.log("[ATTENDANCE] Weekly chart generated");
    const labels = weeklyData.map((item) => item.name);
    const present = weeklyData.map((item) => item.present);
    const absent = weeklyData.map((item) => item.absent);

    return res.status(200).json({
      success: true,
      message: "Weekly Attendance fetched",
      data: { labels, present, absent },
    });
  } catch (err) {
    console.error("Weekly Attendance Error:", err);
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

const attendanceUpdate = async (req, res, next) => {
  try {
    const { employeeId, date, status, remarks } = req.body;

    if (!employeeId || !date || !status) {
      return next(
        new ApiError(400, "employeeId, date, and status are required")
      );
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const dayStart = new Date(targetDate);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const hasLeave = await hasLeaveOnDate(employeeId, targetDate);
    const finalStatus = hasLeave ? "L" : status;

    let attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: dayStart, $lte: dayEnd },
    });

    if (!attendance) {
      attendance = await Attendance.create({
        employeeId,
        date: targetDate,
        status: finalStatus,
        leave: finalStatus === "L",
        remark: remarks || null,
        isFullDay: finalStatus === "P",
        isHalfDay: finalStatus === "HD",
      });
    } else {
      attendance.status = finalStatus;
      attendance.leave = finalStatus === "L";
      attendance.remark = remarks || null;
      attendance.isFullDay = finalStatus === "P";
      attendance.isHalfDay = finalStatus === "HD";
      await attendance.save();
    }

    return res.status(200).json({
      success: true,
      message: hasLeave
        ? "Attendance auto converted to Leave (Leave Applied)"
        : "Attendance updated successfully",
      data: attendance,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

/**
 * @route GET /attendance/by-city
 * @desc Fetch attendance only for employees belonging to HR's city (from token)
 * @access Private (HR)
 */
const getAttendanceByCity = async (req, res, next) => {
  try {
    // --- date query param handling ---
    const { date } = req.query;
    console.log("DATE FROM QUERY:", date);

    let startDateUTC = null;
    let endDateUTC = null;

    if (date) {
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) {
        return next(new ApiError(400, "Invalid date format. Use YYYY-MM-DD"));
      }

      startDateUTC = new Date(parsed);
      startDateUTC.setUTCHours(0, 0, 0, 0);

      endDateUTC = new Date(parsed);
      endDateUTC.setUTCHours(23, 59, 59, 999);
    }
    // --- end date query param handling ---

    const employees = await EmployeeProfile.find().select(
      "name email phone city cityId departmentId designationId branchId photo"
    );

    const employeeIds = employees.map((emp) => emp._id);

    // --- Attendance query with date filter ---
    const matchQuery = {
      employeeId: { $in: employeeIds },
    };

    if (startDateUTC && endDateUTC) {
      matchQuery.date = { $gte: startDateUTC, $lte: endDateUTC };
    }

    const result = await Attendance.find(matchQuery)
      .populate({
        path: "employeeId",
        select:
          "name email phone empId city departmentId designationId branchId photo",
        populate: [
          { path: "city", select: "name" },
          { path: "departmentId", select: "title" },
          { path: "designationId", select: "title" },
          { path: "branchId", select: "title" },
        ],
      })
      .lean();

    const attendanceMap = {};
    result.forEach((att) => {
      attendanceMap[att.employeeId._id.toString()] = att;
    });

    const finalResult = employees.map((emp) => {
      const empId = emp._id.toString();
      const att = attendanceMap[empId];

      let mapsLink = null;
      if (att && att.location?.coordinates?.length === 2) {
        const [lng, lat] = att.location.coordinates;
        mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
      }

      return {
        employeeId: {
          _id: emp._id,
          name: att?.employeeId?.name || emp.name,
          email: att?.employeeId?.email || "",
          phone: att?.employeeId?.phone || "",
          city: att?.employeeId?.city || emp.city || null,
          departmentId: att?.employeeId?.departmentId || null,
          designationId: att?.employeeId?.designationId || null,
          branchId: att?.employeeId?.branchId || null,
          photoUrl: att?.employeeId?.photo?.url || emp.photo?.url || null,
        },
        status: att?.status || "A",
        loginTime: att?.loginTime || null,
        logoutTime: att?.logoutTime || null,
        workingHours: att?.workingHours || "--",
        checkIn: att?.checkIn || false,
        leave: att?.leave || false,
        remark: att?.remark || null,
        date: att?.date || null,
        mapsLink,
      };
    });

    console.log("FINAL HR CITY ATTENDANCE RESULT --->", finalResult);
    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully (city removed)",
      data: finalResult,
    });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

const getAttendanceByDateSecond = async (req, res, next) => {
  try {
    const { date } = req.query; // expected YYYY-MM-DD

    console.log("[ATTENDANCE] /by-date called with:", date);

    if (!date) {
      console.error("[ATTENDANCE] Missing date param");
      return res.status(400).json({
        success: false,
        message: "date query param (YYYY-MM-DD) is required",
      });
    }

    const startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      console.error("[ATTENDANCE] Invalid date param:", date);
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    // Force date boundaries to UTC so MongoDB comparisons match correctly
    const startDateUTC = new Date(startDate);
    startDateUTC.setUTCHours(0, 0, 0, 0);

    const endDateUTC = new Date(startDate);
    endDateUTC.setUTCHours(23, 59, 59, 999);

    // safer aggregation: match attendance by date range instead of string conversion
    const result = await EmployeeProfile.aggregate([
      {
        $lookup: {
          from: "attendances",
          let: { empId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$employeeId", "$$empId"] },
                    { $gte: ["$date", startDateUTC] },
                    { $lte: ["$date", endDateUTC] },
                  ],
                },
              },
            },
          ],
          as: "attendance",
        },
      },
      {
        $unwind: { path: "$attendance", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          loginTime: { $ifNull: ["$attendance.loginTime", null] },
          logoutTime: { $ifNull: ["$attendance.logoutTime", null] },
          status: { $ifNull: ["$attendance.status", null] },
          remarks: { $ifNull: ["$attendance.remarks", null] },
          rawAttendance: "$attendance",
        },
      },
    ]).allowDiskUse(true);

    console.log("[ATTENDANCE] Date-wise result count:", result.length);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("[ATTENDANCE] getAttendanceByDateSecond Error:", err);
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

export {
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
};
