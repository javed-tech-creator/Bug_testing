import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import { RecceAssigned } from "../../models/recceAssigned.base.model.js";
import RecceDetail from "../../models/recceDetail.model.js";

export const requestRecceAssignment = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id, remark } = req.body; // design_id
    const executiveId = req.user?._id?.toString();
    const role = req.user?.designation?.title || "";

    /* ---------------- VALIDATION ---------------- */

    if (!executiveId) {
      return next(new ApiError(401, "Unauthorized user"));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid design id"));
    }

    if (!remark?.trim()) {
      return next(new ApiError(400, "Remark is required"));
    }

    /* ---------------- DESIGN EXIST CHECK ---------------- */

    const recceRequest = await RecceAssigned.findById(id).session(session);

    if (!recceRequest) {
      return next(new ApiError(404, "Recce not found"));
    }

    /* ---------------- DUPLICATE REQUEST CHECK ---------------- */

    const alreadyRequested = recceRequest.user_assignment_requests?.some(
      (req) => req.user_id?.toString() === executiveId,
    );

    if (alreadyRequested) {
      return next(
        new ApiError(
          409,
          "You have already requested assignment for this recce",
        ),
      );
    }

    /* ---------------- UPDATE REQUEST ARRAY ---------------- */

    recceRequest.user_assignment_requests.push({
      user_id: executiveId,
      remark,
      // requested_at handled by schema
    });

    await recceRequest.save({ session });

    /* ---------------- EVENT LOG (TRACKER) ---------------- */

    // const message = `Executive requested recce assignment`;

    // await RecceEventLog.findOneAndUpdate(
    //   {
    //     recce_id: recceRequest._id,
    //     product_id: recceRequest.product_id,
    //   },
    //   {
    //     $push: {
    //       events: {
    //         performed_by: executiveId,
    //         performed_role: role,
    //         action_type: "recce_assignment_requested",
    //         message,
    //       },
    //     },
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //     setDefaultsOnInsert: true,
    //     session,
    //   },
    // );

    /* ---------------- COMMIT ---------------- */

    await session.commitTransaction();
    session.endSession();

    /* ---------------- RESPONSE ---------------- */

    return res.status(200).json({
      success: true,
      message: "Recce assignment request submitted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

export const getDesignAssignmentRequests = async (req, res, next) => {
  try {
    const { id } = req.params; // design _id

    /* ---------------- VALIDATION ---------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid design id"));
    }

    /* ---------------- FETCH DESIGN WITH REQUESTS ---------------- */

    const recce = await RecceDetail.findById(id)
      .select("user_assignment_requests")
      .populate({
        path: "user_assignment_requests.user_id",
        select: "name designation employeeType",
        populate: {
          path: "designation",
          select: "title",
        },
      })
      .lean();

    if (!recce) {
      return next(new ApiError(404, "Recce not found"));
    }

    /* ---------------- FORMAT RESPONSE ---------------- */

    const requests = recce.user_assignment_requests.map((req) => ({
      user_id: req.user_id?._id,
      name: req.user_id?.name,
      designation: req.user_id?.designation?.title || "",
      employeeType: req.user_id?.employeeType || "",
      remark: req.remark,
      requested_at: req.requested_at,
    }));

    /* ---------------- RESPONSE ---------------- */

    return res.api(200, "Design assignment requests fetched successfully", {
      count: requests.length,
      requests,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
