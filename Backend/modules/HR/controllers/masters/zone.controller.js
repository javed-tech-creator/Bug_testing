import ApiError from "../../../../utils/master/ApiError.js";
import Zone from "../../models/masters/zone.model.js";
import mongoose from "mongoose";

// Create Zone
export const createZone = async (req, res, next) => {
  try {
    const { title, status } = req.body;

    if (!title) {
      return next(new ApiError(400, "Zone title is required"));
    }

    const existing = await Zone.findOne({ title: title.trim() });

    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        const reactivated = await existing.save();
        return res.api(200, "Zone reactivated successfully !!", reactivated);
      } else {
        return next(new ApiError(400, "Zone title already exists"));
      }
    }

    const zone = new Zone({ title, status });
    const savedZone = await zone.save();
    return res.api(201, "Zone created successfully !!", savedZone);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get All Zones
export const getAllZones = async (req, res, next) => {
  try {
    const zones = await Zone.find({ status: "Active" }).sort({ createdAt: -1 });
    return res.api(200, "Zones fetched successfully !!", zones);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get Zone by ID
export const getZoneById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Zone ID"));
    }

    const zone = await Zone.findOne({ _id: id, status: "Active" });

    if (!zone) {
      return next(new ApiError(404, "Zone not found or inactive"));
    }

    return res.api(200, "Zone fetched successfully !!", zone);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Update Zone
export const updateZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Zone ID"));
    }

    if (title) {
      const existing = await Zone.findOne({ title: title.trim(), _id: { $ne: id } });
      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivated = await existing.save();
          return res.api(200, "Zone reactivated successfully !!", reactivated);
        } else {
          return next(new ApiError(400, "Zone title already exists"));
        }
      }
    }

    const zone = await Zone.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    );

    if (!zone) {
      return next(new ApiError(404, "Zone not found or inactive"));
    }

    return res.api(200, "Zone updated successfully !!", zone);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Soft Delete Zone
export const softDeleteZone = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Zone ID"));
    }

    const zone = await Zone.findByIdAndUpdate(id, { status: "Inactive" }, { new: true });

    if (!zone) {
      return next(new ApiError(404, "Zone not found"));
    }

    return res.api(200, "Zone soft deleted (Inactive) successfully !!", zone);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Delete Zone Permanently
export const deleteZonePermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Zone ID"));
    }

    const zone = await Zone.findByIdAndDelete(id);

    if (!zone) {
      return next(new ApiError(404, "Zone not found"));
    }

    return res.api(200, "Zone permanently deleted successfully !!", zone);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
