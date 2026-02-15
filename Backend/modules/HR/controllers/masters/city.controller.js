import ApiError from "../../../../utils/master/ApiError.js";
import City from "../../models/masters/city.model.js";
import State from "../../models/masters/state.model.js";
import mongoose from "mongoose";

// Create City
export const createCity = async (req, res, next) => {
  try {
    const { title, stateId, status } = req.body;

    // Validate required fields
    if (!title) {
      return next(new ApiError(400, "City title is required"));
    }
    if (!stateId) {
      return next(new ApiError(400, "stateId is required"));
    }
    if (!mongoose.isValidObjectId(stateId)) {
      return next(new ApiError(400, "Invalid State ID"));
    }

    // Verify related state exists and is active
    const stateExists = await State.findOne({ _id: stateId, status: "Active" });
    if (!stateExists) {
      return next(new ApiError(404, "State not found or inactive"));
    }

    // Check for existing city with same title in this state
    const existing = await City.findOne({ title: title.trim(), stateId });

    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        const reactivated = await existing.save();
        return res.api(200, "City reactivated successfully !!", reactivated);
      }
      return next(new ApiError(400, "City title already exists in this state"));
    }

    const city = new City({ title, stateId, status });
    const savedCity = await city.save();
    return res.api(201, "City created successfully !!", savedCity);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get All Cities
export const getAllCities = async (req, res, next) => {
  try {
    const cities = await City.find({ status: "Active" })
      .populate("stateId", "title stateId")
      .sort({ createdAt: -1 });
    return res.api(200, "Cities fetched successfully !!", cities);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get City by ID
export const getCityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid City ID"));
    }

    const city = await City.findOne({ _id: id, status: "Active" })
      .populate("stateId", "title stateId");

    if (!city) {
      return next(new ApiError(404, "City not found or inactive"));
    }

    return res.api(200, "City fetched successfully !!", city);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Update City
export const updateCity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, stateId } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid City ID"));
    }

    // If updating or changing title or stateId, check for duplicates
    if (title || stateId) {
      // If not provided, get current stateId to use for duplicate check
      let targetStateId = stateId;
      if (!stateId) {
        const currentCity = await City.findById(id);
        targetStateId = currentCity?.stateId;
      }

      // Validate stateId if provided
      if (targetStateId && !mongoose.isValidObjectId(targetStateId)) {
        return next(new ApiError(400, "Invalid State ID"));
      }

      // If stateId changed or title changed, verify State existence
      if (targetStateId) {
        const stateExists = await State.findOne({ _id: targetStateId, status: "Active" });
        if (!stateExists) {
          return next(new ApiError(404, "State not found or inactive"));
        }
      }

      // Check for existing city with same title in this state excluding current city
      const existing = await City.findOne({
        title: title ? title.trim() : undefined,
        stateId: targetStateId,
        _id: { $ne: id },
      });

      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivated = await existing.save();
          return res.api(200, "City reactivated successfully !!", reactivated);
        }
        return next(new ApiError(400, "City title already exists in this state"));
      }
    }

    const city = await City.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    ).populate("stateId", "title stateId");

    if (!city) {
      return next(new ApiError(404, "City not found or inactive"));
    }

    return res.api(200, "City updated successfully !!", city);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Soft Delete City
export const softDeleteCity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid City ID"));
    }

    const city = await City.findByIdAndUpdate(id, { status: "Inactive" }, { new: true });

    if (!city) {
      return next(new ApiError(404, "City not found"));
    }

    return res.api(200, "City soft deleted (Inactive) successfully !!", city);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Delete City Permanently
export const deleteCityPermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid City ID"));
    }

    const city = await City.findByIdAndDelete(id);

    if (!city) {
      return next(new ApiError(404, "City not found"));
    }

    return res.api(200, "City permanently deleted successfully !!", city);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getCityByStateId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid state ID"));
    }

    const state = await State.findOne({ _id: id, status: "Active" });
    if (!state) {
      return next(new ApiError(404, "state not found or inactive"));
    }

    const cities = await City.find({ stateId: id, status: "Active" })
      .populate("stateId", "stateId title")
      .sort({ createdAt: -1 });

    return res.api(200, `Cities fetched successfully for State ID ${id}`, cities);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
