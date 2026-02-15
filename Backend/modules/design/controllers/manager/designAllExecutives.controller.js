import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import User from "../../../HR/models/masters/user.model.js";

export const getExecutivesForAssignment = async (req, res, next) => {
  try {
    const managerId = req.user?._id.toString();
    const branchId = req.user?.branch?._id.toString();
    const departmentId = req.user?.department?._id.toString();
    const managerDesignationId = req.user?.designation?._id.toString();

    /* ---------------- VALIDATION ---------------- */

    if (!branchId || !departmentId || !managerDesignationId) {
      return next(
        new ApiError(
          400,
          "Branch, department or designation not found in user context",
        ),
      );
    }

    /* ---------------- QUERY ---------------- */

    const users = await User.find({
      branch: branchId, //  same branch
      department: departmentId, //  same department
      designation: { $ne: managerDesignationId }, // ❌ manager designation exclude
      _id: { $ne: managerId }, //  self exclude (extra safety)
      status: "Active", // optional but recommended
    })
      .select("_id name designation")
      .populate("designation", "title")
      .lean();

    /* ---------------- RESPONSE ---------------- */

    return res.api(200, "Department's All Executives fetched successfully", {
      count: users.length,
      users,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
