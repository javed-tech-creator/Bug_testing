import mongoose from "mongoose";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import DesignRequested from "../../models/manager/designRequested.model.js";
import ApiError from "../../../../utils/master/ApiError.js";

export const markDesignAsStarted = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { id: design_request_id } = req.params;
    const loggedInUserId = req.user._id?.toString();

    // 1️⃣ Validate design_request_id
    if (!mongoose.Types.ObjectId.isValid(design_request_id)) {
      return next(new ApiError(400, "Invalid design_request_id"));
    }

    session.startTransaction();

    // 2️⃣ Find active assignment for this design request
    const designAssigned = await DesignAssigned.findOne({
      design_request_id,
      is_active: true,
    }).session(session);

    if (!designAssigned) {
      await session.abortTransaction();
      return next(new ApiError(404, "Active design assignment not found"));
    }

    // 3️⃣ Only assigned user can start
    if (
      !designAssigned.assigned_to ||
      designAssigned.assigned_to.toString() !== loggedInUserId
    ) {
      await session.abortTransaction();
      return next(
        new ApiError(403, "You are not authorized to start this design"),
      );
    }

    // 4️⃣ Already started check
    if (designAssigned.mark_as_started) {
      await session.abortTransaction();
      return next(new ApiError(400, "Design already marked as started"));
    }

    // 5️⃣ Update DesignAssigned
    designAssigned.mark_as_started = true;
    designAssigned.started_at = Date.now();

    await designAssigned.save({ session });

    // 6️⃣ Update DesignRequested
    await DesignRequested.findByIdAndUpdate(
      design_request_id,
      {
        $set: {
          mark_as_started: true,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Design marked as started successfully",
      data: designAssigned,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Mark design as started error:", error);

    return next(new ApiError(500, error.message));
  } finally {
    session.endSession();
  }
};
