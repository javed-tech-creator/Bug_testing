import mongoose from "mongoose";
import DesignRequested from "../../models/manager/designRequested.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import DesignEventLog from "../../models/common_schema/EventsLogs.model.js";

export const requestDesignAssignment = async (req, res, next) => {
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

    const designRequest = await DesignRequested.findById(id).session(session);

    if (!designRequest) {
      return next(new ApiError(404, "Design not found"));
    }

    /* ---------------- DUPLICATE REQUEST CHECK ---------------- */

    const alreadyRequested = designRequest.user_assignment_requests?.some(
      (req) => req.user_id?.toString() === executiveId,
    );

    if (alreadyRequested) {
      return next(
        new ApiError(
          409,
          "You have already requested assignment for this design",
        ),
      );
    }

    /* ---------------- UPDATE REQUEST ARRAY ---------------- */

    designRequest.user_assignment_requests.push({
      user_id: executiveId,
      remark,
      // requested_at handled by schema
    });

    await designRequest.save({ session });

    /* ---------------- EVENT LOG (TRACKER) ---------------- */

    const message = `Executive requested design assignment`;

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: designRequest._id,
        product_id: designRequest.product_id,
      },
      {
        $push: {
          events: {
            performed_by: executiveId,
            performed_role: role,
            action_type: "design_assignment_requested",
            message,
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session,
      },
    );

    /* ---------------- COMMIT ---------------- */

    await session.commitTransaction();
    session.endSession();

    /* ---------------- RESPONSE ---------------- */

    return res.api(200, "Design assignment request submitted successfully");
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

    const design = await DesignRequested.findById(id)
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

    if (!design) {
      return next(new ApiError(404, "Design not found"));
    }

    /* ---------------- FORMAT RESPONSE ---------------- */

    const requests = design.user_assignment_requests.map((req) => ({
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
