import mongoose from "mongoose";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import { DesignMockupVersionModel } from "../../models/common_schema/designMockupVersion.model.js";
import { DesignOptionsModel } from "../../models/common_schema/designOptions.model.js";

export const markMeasurementStarted = async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    if (!userId) {
      throw new ApiError(401, "Unauthorized access");
    }

    // const { designMockupVersionId } = req.params;
    const { id } = req.params;
    const designMockupVersionId = id;
    console.log('designMockupVersionId:>', designMockupVersionId)
    console.log('id:>', designMockupVersionId)

    if (!designMockupVersionId) {
      throw new ApiError(400, "DesignMockupVersion ID is required");
    }

    /* ---------------------------------------
       1️ Update DesignMockupVersion
    --------------------------------------- */
    const mockupDoc = await DesignMockupVersionModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(designMockupVersionId),
        is_active: true,
        mark_as_measurement_started: false,
      },
      {
        $set: {
          mark_as_measurement_started: true,
        },
      },
      { new: true },
    );

    if (!mockupDoc) {
      throw new ApiError(
        404,
        "Mockup not found or measurement already started",
      );
    }

    /* ---------------------------------------
       2️ Update DesignAssigned
    --------------------------------------- */
    await DesignAssigned.findOneAndUpdate(
      {
        _id: mockupDoc.design_assigned_id,
        is_active: true,
        work_status: "on_track",
        "current_plan.approval_status": "accepted",
      },
      {
        $set: {
          mark_as_measurement_started: true,
          measurement_started_at: new Date(),
        },
      },
    );

    /* ---------------------------------------
       3 Update Design option
    --------------------------------------- */
    await DesignOptionsModel.findOneAndUpdate(
      {
        _id: mockupDoc.design_option_id,
        is_active: true,
      },
      {
        $set: {
          mark_as_measurement_started: true,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Measurement process started successfully",
      data: {
        designMockupVersionId: mockupDoc._id,
        design_assigned_id: mockupDoc.design_assigned_id,
      },
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};
