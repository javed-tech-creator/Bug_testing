import mongoose from "mongoose";
import MonthlyTarget from "../../models/target/monthlyTarget.model.js";
import SlotTarget from "../../models/target/slotTarget.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import User from "../../../HR/models/masters/user.model.js";

export const saveSlotTarget = async (req, res, next) => {
  try {
     if (!req.body) {
          return next(new ApiError(400, "Request body missing"));
        }
    const {
      monthlyTargetId,
      executiveId,
      financialYear,
      quarter,
      month,
      slot,
      slotTarget,
      achievedAmount,
      leadIn,
      salesIn,
      businessIn,
      amountIn,
      meetingNotes,
      carryForwardReason
    } = req.body;

    if (!mongoose.isValidObjectId(executiveId)) {
      return next(new ApiError(400, "Invalid executiveId"));
    }

    if (!mongoose.isValidObjectId(monthlyTargetId)) {
      return next(new ApiError(400, "Invalid monthlyTargetId"));
    }

    // validate executive user
    const executive = await User.findOne({ _id: executiveId, status: "Active" });
    if (!executive) return next(new ApiError(404, "Executive not found"));

    const monthlyTarget = await MonthlyTarget.findById(monthlyTargetId);
    if (!monthlyTarget) {
      return next(new ApiError(404, "Monthly target not found"));
    }

    // validate slot target
    if (!slotTarget || Number(slotTarget) < 0) {
      return next(new ApiError(400, "Slot target required and must be >= 0"));
    }

    // validate achieved amount
    if (achievedAmount && achievedAmount > slotTarget) {
      return next(new ApiError(400, "Achieved amount cannot exceed slot target"));
    }

    // numeric max validation
    const limits = {
      leadIn: 99999,
      salesIn: 9999,
      businessIn: 9999,
      amountIn: 100000000
    };

    if (leadIn > limits.leadIn) return next(new ApiError(400, "LeadIn out of range"));
    if (salesIn > limits.salesIn) return next(new ApiError(400, "SalesIn out of range"));
    if (businessIn > limits.businessIn) return next(new ApiError(400, "BusinessIn out of range"));
    if (amountIn > limits.amountIn) return next(new ApiError(400, "AmountIn out of range"));

    // find slot if exists
    const existingSlot = await SlotTarget.findOne({
      monthlyTargetId,
      executiveId,
      slot
    });

    let slotDoc;

    if (existingSlot) {
      // update existing slot
      existingSlot.slotTarget = slotTarget;
      existingSlot.achievedAmount = achievedAmount ?? existingSlot.achievedAmount;
      existingSlot.leadIn = leadIn ?? existingSlot.leadIn;
      existingSlot.salesIn = salesIn ?? existingSlot.salesIn;
      existingSlot.businessIn = businessIn ?? existingSlot.businessIn;
      existingSlot.amountIn = amountIn ?? existingSlot.amountIn;
      existingSlot.meetingNotes = meetingNotes ?? existingSlot.meetingNotes;
      existingSlot.carryForwardReason = carryForwardReason ?? existingSlot.carryForwardReason;
      existingSlot.submittedAt = new Date();

      slotDoc = await existingSlot.save();
    } else {
      // create new slot
      slotDoc = await SlotTarget.create({
        monthlyTargetId,
        executiveId,
        financialYear,
        quarter,
        month,
        slot,
        slotTarget,
        achievedAmount: achievedAmount || 0,
        leadIn,
        salesIn,
        businessIn,
        amountIn,
        meetingNotes,
        carryForwardReason,
        submittedAt: new Date()
      });
    }

    return res.api(200, "Slot target saved successfully", slotDoc);

  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const updateSlotTarget = async (req, res, next) => {
  try {
    const { slotId } = req.params;

    if (!mongoose.isValidObjectId(slotId)) {
      return next(new ApiError(400, "Invalid slotId"));
    }

    const {
      slotTarget,
      achievedAmount,
      leadIn,
      salesIn,
      businessIn,
      amountIn,
      meetingNotes,
      carryForwardReason
    } = req.body;

    const slotDoc = await SlotTarget.findById(slotId);
    if (!slotDoc) return next(new ApiError(404, "Slot target not found"));

    const monthlyTarget = await MonthlyTarget.findById(slotDoc.monthlyTargetId);
    if (!monthlyTarget) return next(new ApiError(404, "Monthly target not found"));

    // slot target validation
    if (slotTarget !== undefined && slotTarget < 0) {
      return next(new ApiError(400, "Slot target must be >= 0"));
    }

    // achieved cannot exceed slot target
    if (achievedAmount !== undefined) {
      const check = slotTarget !== undefined ? slotTarget : slotDoc.slotTarget;
      if (achievedAmount > check) {
        return next(new ApiError(400, "Achieved cannot exceed slotTarget"));
      }
    }

    // numeric limits
    const limits = {
      leadIn: 99999,
      salesIn: 9999,
      businessIn: 9999,
      amountIn: 9999
    };

    if (leadIn > limits.leadIn) return next(new ApiError(400, "LeadIn out of range"));
    if (salesIn > limits.salesIn) return next(new ApiError(400, "SalesIn out of range"));
    if (businessIn > limits.businessIn) return next(new ApiError(400, "BusinessIn out of range"));
    if (amountIn > limits.amountIn) return next(new ApiError(400, "AmountIn out of range"));

    // update fields
    if (slotTarget !== undefined) slotDoc.slotTarget = slotTarget;
    if (achievedAmount !== undefined) slotDoc.achievedAmount = achievedAmount;
    if (leadIn !== undefined) slotDoc.leadIn = leadIn;
    if (salesIn !== undefined) slotDoc.salesIn = salesIn;
    if (businessIn !== undefined) slotDoc.businessIn = businessIn;
    if (amountIn !== undefined) slotDoc.amountIn = amountIn;
    if (meetingNotes !== undefined) slotDoc.meetingNotes = meetingNotes;
    if (carryForwardReason !== undefined) slotDoc.carryForwardReason = carryForwardReason;

    slotDoc.submittedAt = new Date();

    const updated = await slotDoc.save();

    return res.api(200, "Slot target updated", updated);

  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
