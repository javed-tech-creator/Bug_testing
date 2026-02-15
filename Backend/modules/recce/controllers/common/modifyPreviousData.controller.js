import mongoose from "mongoose";
import Client from "../../../sales/models/client.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import Lead from "../../../sales/models/lead.model.js";

export const updateClientBasicDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID",
      });
    }

    const {
      name,
      email,
      phone,
      whatsapp,
      altPhone,
      companyName,
      designation,
    } = req.body;

    // Allowed fields only
    const updateData = {
      name,
      email,
      phone,
      whatsapp,
      altPhone,
      companyName,
      designation,
    };

    // Remove undefined fields (important)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const updateLeadContactPersonDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Lead ID",
      });
    }

    const {
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      contactPersonAltPhone,
      clientDesignation,
    } = req.body;

    // 2️⃣ Allowed fields only
    const updateData = {
      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      contactPersonAltPhone,
      clientDesignation,
    };

    // Remove undefined fields (important for partial update)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead contact details updated successfully",
      data: updatedLead,
    });

  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};