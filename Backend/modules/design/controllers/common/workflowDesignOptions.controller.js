import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";

export const getDesignsForOptionUpload = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    const role = req.user?.designation?.title?.toLowerCase() || "";
    const branchId = req.user?.branch?._id?.toString();

    if (!userId) {
      return next(new ApiError(401, "Unauthorized user"));
    }

    if (!branchId) {
      return next(new ApiError(400, "Branch not found"));
    }

    /* ---------------- BASE QUERY ---------------- */

    const query = {
      is_active: true,
      mark_as_started: true,
      design_option_uploaded: false,
    };

    /* ---------------- ROLE BASED FILTER ---------------- */
    // executive → sirf apna kaam
    if (role === "executive") {
      query.assignment_type = "executive";
      query.assigned_to = userId;
    }

    // manager → self assignment
    if (role === "manager") {
      query.assignment_type = "self";
      query.assigned_to = userId;
    }

    /* ---------------- FETCH ---------------- */

    const designs = await DesignAssigned.find(query)
      .sort({ createdAt: -1 }) // index friendly
      .lean();

    return res.api(
      200,
      "Designs fetched for upload workflow successfully",
      designs,
    );
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
