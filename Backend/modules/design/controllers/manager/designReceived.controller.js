import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import DesignEventLog from "../../models/common_schema/EventsLogs.model.js";
import DesignRequested from "../../models/manager/designRequested.model.js";


export const designReceivedConfirmation = async (
  req,
  res,
  next,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id, feedback_panel, receiving_checklist } = req.body;
    const receivedBy = req.user?._id?.toString();
    const role = req.user?.designation?.title.toLowerCase() || "";

    /* ---------------- AUTH & ID VALIDATION ---------------- */

    if (!receivedBy) {
      return next(new ApiError(401, "Unauthorized user"));
    }

      if (role !== "manager") {
      return next(new ApiError(401, "Only Manager can receive design request"));
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid design id"));
    }

    /* ---------------- FEEDBACK VALIDATION ---------------- */

    if (!feedback_panel) {
      return next(new ApiError(400, "Feedback panel is required"));
    }

    const {
      feedback,
      rating,
      final_decision,
      decline_remark,
      flag_type,
      flag_remark,
    } = feedback_panel;

    if (!feedback?.trim()) {
      return next(new ApiError(400, "Feedback is required"));
    }

    if (rating === null || rating === undefined) {
      return next(new ApiError(400, "Feedback rating is required"));
    }

    if (!final_decision) {
      return next(new ApiError(400, "Final decision is required"));
    }

    /* ---------------- CONDITIONAL RULES ---------------- */

    if (final_decision === "decline") {
      if (!decline_remark?.trim()) {
        return next(
          new ApiError(400, "Decline remark is required"),
        );
      }
    }

    if (final_decision === "flag") {
      if (!flag_type) {
        return next(
          new ApiError(400, "Flag type is required"),
        );
      }

      if (!flag_remark?.trim()) {
        return next(
          new ApiError(400, "Flag remark is required"),
        );
      }
    }

    /* ---------------- CHECKLIST VALIDATION ---------------- */

    if (
      !Array.isArray(receiving_checklist) ||
      receiving_checklist.length === 0
    ) {
      return next(
        new ApiError(400, "Receiving checklist is required"),
      );
    }

    /* ---------------- FETCH DESIGN ---------------- */

    const design = await DesignRequested.findById(id).session(
      session,
    );

    if (!design) {
      return next(new ApiError(404, "Design not found"));
    }

    /* ---------------- RECEIVE CONFIRMATION ---------------- */

    if (!design.received_by) {
      design.received_by = receivedBy;
      design.received_date = new Date();
    }

    /* ---------------- REMARK MERGE (OPTIONAL) ---------------- */

    const remarkFields = [
      "environmental_conditions",
      "product_requirements_remark",
      "upload_photos_remark",
      "upload_videos_remark",
      "installation_details_remark",
      "raw_recce_remark",
      "data_from_client_remark",
      "additional_instruction_remark",
    ];

    remarkFields.forEach((field) => {
      if (req.body[field]) {
        design[field] = {
          ...design[field]?.toObject?.(),
          ...req.body[field],
        };
      }
    });

    /* ---------------- CHECKLIST UPDATE ---------------- */

    design.receiving_checklist = receiving_checklist;

    /* ---------------- FEEDBACK UPDATE ---------------- */

    design.feedback_panel = {
      feedback,
      rating,
      final_decision,
      decline_remark:
        final_decision === "decline" ? decline_remark : "",
      flag_type:
        final_decision === "flag" ? flag_type : "",
      flag_remark:
        final_decision === "flag" ? flag_remark : "",
    };

    await design.save({ session });

    /* ---------------- EVENT TRACKER ---------------- */

    let action_type = "design_received";
    let message = "Design received and reviewed";

    if (final_decision === "accepted") {
      action_type = "design_accepted";
      message = "Design accepted by manager";
    }

    if (final_decision === "decline") {
      action_type = "design_declined";
      message = "Design declined by manager";
    }

    if (final_decision === "flag") {
      action_type = "design_flagged";
      message = "Design flagged for review";
    }

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: design._id,
        product_id: design.product_id,
      },
      {
        $push: {
          events: {
            performed_by: receivedBy,
            performed_role: role,
            action_type,
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

    return res.api(
      200,
      "Design received and finalized successfully",
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

