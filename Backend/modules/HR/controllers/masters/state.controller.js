import ApiError from "../../../../utils/master/ApiError.js";
import State from "../../models/masters/state.model.js";
import Zone from "../../models/masters/zone.model.js";
import mongoose from "mongoose";

// Create State
export const createState = async (req, res, next) => {
  try {
    const { title, zoneId, status } = req.body;
    if (!title) {
      return next(new ApiError(400, "State title is required"));
    }
    if (!zoneId || !mongoose.isValidObjectId(zoneId)) {
      return next(new ApiError(400, "Valid zoneId is required"));
    }
    const zone = await Zone.findOne({ _id: zoneId, status: "Active" });
    if (!zone) {
      return next(new ApiError(400, "Active parent zone not found"));
    }

    const existing = await State.findOne({ title: title.trim(), zoneId });
    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        const reactivated = await existing.save();
        return res.api(200, "State reactivated successfully !!", reactivated);
      } else {
        return next(new ApiError(400, "State title already exists under this zone"));
      }
    }

    const state = new State({ title, zoneId, status });
    const savedState = await state.save();
    return res.api(201, "State created successfully !!", savedState);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get All States
export const getAllStates = async (req, res, next) => {
  try {
    const states = await State.find({ status: "Active" })
      .populate("zoneId", "zoneId title")
      .sort({ createdAt: -1 });
    return res.api(200, "States fetched successfully !!", states);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get State by ID
export const getStateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid State ID"));
    }
    const state = await State.findOne({ _id: id, status: "Active" }).populate("zoneId", "zoneId title");
    if (!state) {
      return next(new ApiError(404, "State not found or inactive"));
    }
    return res.api(200, "State fetched successfully !!", state);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Update State
export const updateState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, zoneId } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid State ID"));
    }
    if (zoneId && !mongoose.isValidObjectId(zoneId)) {
      return next(new ApiError(400, "Invalid zoneId"));
    }
    if (zoneId) {
      const zone = await Zone.findOne({ _id: zoneId, status: "Active" });
      if (!zone) {
        return next(new ApiError(400, "Active parent zone not found"));
      }
    }

    if (title) {
      const existing = await State.findOne({
        title: title.trim(),
        zoneId: zoneId || (await State.findById(id)).zoneId,
        _id: { $ne: id },
      });
      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivated = await existing.save();
          return res.api(200, "State reactivated successfully !!", reactivated);
        } else {
          return next(new ApiError(400, "State title already exists under this zone"));
        }
      }
    }

    const state = await State.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    ).populate("zoneId", "zoneId title");

    if (!state) {
      return next(new ApiError(404, "State not found or inactive"));
    }
    return res.api(200, "State updated successfully !!", state);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Soft Delete State
export const softDeleteState = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid State ID"));
    }

    const state = await State.findByIdAndUpdate(id, { status: "Inactive" }, { new: true });
    if (!state) {
      return next(new ApiError(404, "State not found"));
    }
    return res.api(200, "State soft deleted (Inactive) successfully !!", state);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Delete State Permanently
export const deleteStatePermanently = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid State ID"));
    }

    const state = await State.findByIdAndDelete(id);
    if (!state) {
      return next(new ApiError(404, "State not found"));
    }
    return res.api(200, "State permanently deleted successfully !!", state);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};


export const getStatesByZoneId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Zone ID"));
    }

    const zone = await Zone.findOne({ _id: id, status: "Active" });
    if (!zone) {
      return next(new ApiError(404, "Zone not found or inactive"));
    }

    const states = await State.find({ zoneId: id, status: "Active" })
      .populate("zoneId", "zoneId title")
      .sort({ createdAt: -1 });

    return res.api(200, `States fetched successfully for Zone ID ${id}`, states);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};