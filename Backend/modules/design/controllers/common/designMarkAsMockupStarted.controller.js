import mongoose from "mongoose";
import { DesignOptionsModel } from "../../models/common_schema/designOptions.model.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import ApiError from "../../../../utils/master/ApiError.js";

export const markAsMockupStarted = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id: design_option_id } = req.params;

    console.log(design_option_id)

    /* ---------------- VALIDATION ---------------- */
    if (!design_option_id) {
      return next(new ApiError(400, "design_option_id required"));
    }

    if (!mongoose.Types.ObjectId.isValid(design_option_id)) {
      return next(new ApiError(400, "Invalid design_option_id"));
    }

    /* ---------------- FIND DESIGN OPTION ---------------- */
    const designOption =
      await DesignOptionsModel.findById(design_option_id).session(session);

    if (!designOption) {
      return next(new ApiError(404, "Design option not found"));
    }

    /* ---------------- UPDATE DESIGN OPTIONS ---------------- */
    if (!designOption.mark_as_mockup_started) {
      designOption.mark_as_mockup_started = true;
      await designOption.save({ session });
    }

    const designAssignedId = designOption.design_assigned_id;

    /* ---------------- UPDATE DESIGN ASSIGNED ---------------- */
    const updatedAssigned = await DesignAssigned.findOneAndUpdate(
      {
        _id: designAssignedId,
        is_active: true,
      },
      {
        $set: {
          mark_as_mockup_started: true,
          mockup_started_at: new Date(),
        },
      },
      {
        new: true,
        session,
      },
    );

    if (!updatedAssigned) {
      return next(new ApiError(404, "DesignAssigned record not found"));
    }

    /* ---------------- COMMIT ---------------- */
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Mockup started successfully",
      data: {
        design_option_id,
        design_assigned_id: designAssignedId,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};
