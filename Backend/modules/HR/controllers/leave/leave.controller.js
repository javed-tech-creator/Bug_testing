import leaveModel from "../../models/leave/leave.model.js";
import EmployeeProfile from "../../models/onboarding/employeeProfile.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import mongoose from "mongoose";
import Attendance from "../../models/attendance/attendance.model.js";
/**
 *  APPLY LEAVE
 */
export const applyLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Employee ID is required"));
    }
    const { breakDown, reason, leaveType, startDate, endDate, description } =
      req.body;

    if (!leaveType || !startDate || !endDate) {
      return next(
        new ApiError(400, "Please provide leave type, start date and end date.")
      );
    }

    const employee = await EmployeeProfile.findById(id);
    if (!employee) return next(new ApiError(400, "Invalid employee ID"));

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start > end)
      return next(new ApiError(400, "Start date cannot be after end date."));
    if (start < new Date(new Date().setHours(0, 0, 0, 0)))
      return next(new ApiError(400, "Start date cannot be in the past."));

    const existing = await leaveModel.findOne({
      employeeId: id,
      status: { $in: ["Pending", "Approved"] },
      startDate: { $lte: end },
      endDate: { $gte: start },
    });

    if (existing) {
      return next(new ApiError(400, "Leave already applied in this range."));
    }

    const newLeave = await leaveModel.create({
      employeeId: id,
      leaveType,
      startDate,
      endDate,
      reason,
      description,
      breakDown,
    });

    // Create attendance entries for Pending leave so UI/calendars reflect leave immediately.
    // We save leaveSource to be able to clean up if leave is rejected/edited/deleted.
    let loopDate = new Date(start);
    while (loopDate <= end) {
      const dayStart = new Date(loopDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(loopDate);
      dayEnd.setHours(23, 59, 59, 999);

      const existingAttendance = await Attendance.findOne({
        employeeId: id,
        date: { $gte: dayStart, $lte: dayEnd },
      });

      if (!existingAttendance) {
        await Attendance.create({
          employeeId: id,
          date: dayStart,
          status: "L",
          leave: true,
          remark: "Leave Applied (Pending)",
          leaveSource: newLeave._id,
        });
      } else {
        // If an attendance exists (present/absent/wfh), mark it as leave and attach source
        existingAttendance.status = "L";
        existingAttendance.leave = true;
        existingAttendance.isFullDay = false;
        existingAttendance.isHalfDay = false;
        existingAttendance.remark = "Leave Applied - Auto Converted";
        existingAttendance.leaveSource = newLeave._id;
        await existingAttendance.save();
      }

      loopDate.setDate(loopDate.getDate() + 1);
    }

    res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: newLeave,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  GET MY LEAVES
 */
export const getMyLeaves = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const query = { employeeId: id };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const leaves = await leaveModel.find(query).sort({ createdAt: -1 });
    if (!leaves.length)
      return next(new ApiError(404, "No leave applications found."));

    res.status(200).json({ success: true, data: leaves });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  APPROVE LEAVE
 */
export const approveLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leave = await leaveModel.findById(id);
    if (!leave) return next(new ApiError(404, "Leave not found"));
    if (leave.status !== "Pending")
      return next(new ApiError(400, "Already reviewed"));

    leave.status = "Approved";
    await leave.save();

    // Auto-create/update attendance for approved leave range
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);

    let loopDate = new Date(start);
    while (loopDate <= end) {
      const dayStart = new Date(loopDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(loopDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Determine status based on weekend rule
      // const dayOfWeek = dayStart.getDay(); // 0=Sunday, 6=Saturday
      // let finalStatus = "L"; // Default leave
      // if (dayOfWeek === 0 || dayOfWeek === 6) {
      //   finalStatus = "A"; // Weekend = Absent
      // }
      let finalStatus = "A";

      const existingAttendance = await Attendance.findOne({
        employeeId: leave.employeeId,
        date: { $gte: dayStart, $lte: dayEnd },
      });

      if (!existingAttendance) {
        await Attendance.create({
          employeeId: leave.employeeId,
          date: dayStart,
          status: "A",
          leave: false,
          remark: "Leave Approved – Marked Absent",
          leaveSource: leave._id,
        });
      } else {
        // Convert existing to Leave and attach source
        existingAttendance.status = "A";
        existingAttendance.leave = false;
        existingAttendance.isFullDay = false;
        existingAttendance.isHalfDay = false;
        existingAttendance.remark = "Leave Approved – Auto Marked Absent";
        existingAttendance.leaveSource = leave._id;
        await existingAttendance.save();
      }

      loopDate.setDate(loopDate.getDate() + 1);
    }

    console.log({ leave });

    res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  REJECT LEAVE
 */
export const rejectLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leave = await leaveModel.findById(id);
    if (!leave) return next(new ApiError(404, "Leave not found"));
    if (leave.status !== "Pending")
      return next(new ApiError(400, "Already reviewed"));

    leave.status = "Rejected";
    await leave.save();

    // Remove any attendance entries that were created/linked for this leave
    await Attendance.deleteMany({ leaveSource: leave._id });

    res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data: leave,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  EDIT LEAVE
 */
export const editLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { breakDown, leaveType, startDate, endDate, description } = req.body;

    const leave = await leaveModel.findByIdAndUpdate(
      id,
      {
        breakDown,
        leaveType,
        startDate,
        endDate,
        description,
        status: "Pending",
      },
      { new: true }
    );

    if (!leave) return next(new ApiError(404, "Leave not found"));

    // Remove any attendance records linked to this leave and recreate for new dates
    await Attendance.deleteMany({ leaveSource: leave._id });

    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);

    let loopDate = new Date(start);
    while (loopDate <= end) {
      const dayStart = new Date(loopDate);
      dayStart.setHours(0, 0, 0, 0);

      const existingAttendance = await Attendance.findOne({
        employeeId: leave.employeeId,
        date: { $gte: dayStart, $lte: dayStart },
      });

      if (!existingAttendance) {
        await Attendance.create({
          employeeId: leave.employeeId,
          date: dayStart,
          status: "L",
          leave: true,
          remark: "Leave Applied (Edited)",
          leaveSource: leave._id,
        });
      } else {
        existingAttendance.status = "L";
        existingAttendance.leave = true;
        existingAttendance.remark = "Leave Applied (Edited)";
        existingAttendance.leaveSource = leave._id;
        existingAttendance.isFullDay = false;
        existingAttendance.isHalfDay = false;
        await existingAttendance.save();
      }

      loopDate.setDate(loopDate.getDate() + 1);
    }

    res.status(200).json({
      success: true,
      message: "Leave updated successfully",
      data: leave,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  DELETE LEAVE
 */
export const deleteLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leave = await leaveModel.findById(id);
    if (!leave) return next(new ApiError(404, "Leave not found"));
    if (leave.status === "Approved")
      return next(new ApiError(400, "Cannot delete approved leave"));

    // Remove attendance records created for this leave (if any)
    await Attendance.deleteMany({ leaveSource: leave._id });

    await leaveModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Leave deleted successfully" });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  ALL EMPLOYEE LEAVES (with department)
 */
export const allEmployeeLeaves = async (req, res, next) => {
  try {
    const leaves = await leaveModel
      .find()
      .populate({
        path: "employeeId",
        select: "name email mobile empId departmentId designationId branchId",
        populate: [
          { path: "departmentId", select: "title" },
          { path: "designationId", select: "title" },
          { path: "branchId", select: "title" },
        ],
      })
      .sort({ createdAt: -1 });
    const empIds = leaves.map((l) => l.employeeId?._id);
    const workInfo = await EmployeeProfile.find(
      { employeeId: { $in: empIds } },
      { employeeId: 1, department: 1 }
    );

    const merged = leaves.map((leave) => {
      const dept = workInfo.find(
        (w) => w.employeeId.toString() === leave.employeeId?._id.toString()
      );
      return { ...leave.toObject(), department: dept?.department || null };
    });

    res.status(200).json({
      success: true,
      message: "All leaves fetched successfully",
      data: merged,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  SINGLE EMPLOYEE LEAVE SUMMARY
 */
export const singleLeaveSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const query = { employeeId: id };
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const leaves = await leaveModel.find(query);
    const approved = leaves.filter((l) => l.status === "Approved").length;
    const rejected = leaves.filter((l) => l.status === "Rejected").length;

    res.status(200).json({
      success: true,
      message: "Leave summary fetched",
      data: { total: leaves.length, approved, rejected },
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  TODAY’S LEAVES
 */
export const todayLeaves = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const leaves = await leaveModel.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow } } },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employeeInfo",
        },
      },
      { $unwind: "$employeeInfo" },
      {
        $project: {
          _id: 1,
          reason: 1,
          startDate: 1,
          endDate: 1,
          employeeName: "$employeeInfo.name",
        },
      },
    ]);

    res
      .status(200)
      .json({ success: true, message: "Today's leaves fetched", data: leaves });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  LEAVES BY CITY (Only employees belonging to HR's city)
 */
export const getLeavesByCity = async (req, res, next) => {
  try {
    const cityId = req.params?.cityId;

    if (!cityId || !mongoose.isValidObjectId(cityId)) {
      return next(new ApiError(400, "HR cityId missing or invalid in token"));
    }

    // 1. Find employees belonging to the given city
    const employees = await EmployeeProfile.find({ cityId }).select(
      "_id name email phone"
    );

    if (!employees.length) {
      return next(new ApiError(404, "No employees found in this city"));
    }

    const employeeIds = employees.map((emp) => emp._id);

    // 2. Fetch leaves only for employees of this city
    const leaves = await leaveModel
      .find({ employeeId: { $in: employeeIds } })
      .populate({
        path: "employeeId",
        select: "name email phone cityId departmentId designationId branchId",
        populate: [
          { path: "cityId", select: "name" },
          { path: "departmentId", select: "title" },
          { path: "designationId", select: "title" },
          { path: "branchId", select: "title" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Leaves fetched successfully",
      data: leaves,
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

/**
 *  LEAVE CHART DATA (FOR DASHBOARD)
 */
export const getLeaveChart = async (req, res, next) => {
  try {
    const leaves = await leaveModel.find({}, "leaveType");

    if (!leaves || leaves.length === 0) {
      return res.status(200).json({
        success: true,
        labels: [],
        values: [],
      });
    }

    const chartMap = {};

    leaves.forEach((leave) => {
      const type = leave.leaveType || "Other";
      chartMap[type] = (chartMap[type] || 0) + 1;
    });

    const labels = Object.keys(chartMap);
    const values = Object.values(chartMap);

    return res.status(200).json({
      success: true,
      labels,
      values
    });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};
