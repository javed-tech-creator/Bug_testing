
import Branch from "../../models/masters/branch.model.js";
import Zone from "../../models/masters/zone.model.js";
import State from "../../models/masters/state.model.js";
import City from "../../models/masters/city.model.js";
import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";

// Helper to check existence and active status for referenced docs
const checkReferenceExists = async (Model, id, name) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid ${name} ID`);
  }
  const doc = await Model.findOne({ _id: id, status: "Active" });
  if (!doc) {
    throw new ApiError(404, `${name} not found or inactive`);
  }
  return doc;
};

// Create Branch
export const createBranch = async (req, res, next) => {
  try {
    const { title, address, status, zoneId, stateId, cityId } = req.body;

    if (!title) return next(new ApiError(400, "Branch title is required"));
    if (!zoneId) return next(new ApiError(400, "zoneId is required"));
    if (!stateId) return next(new ApiError(400, "stateId is required"));
    if (!cityId) return next(new ApiError(400, "cityId is required"));

    // Validate existence and active status of referenced documents
    await checkReferenceExists(Zone, zoneId, "Zone");
    await checkReferenceExists(State, stateId, "State");
    await checkReferenceExists(City, cityId, "City");

    const existing = await Branch.findOne({
      title: title.trim(),
      zoneId,
      stateId,
      cityId,
    });

    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        existing.address = address || existing.address;
        const reactivatedBranch = await existing.save();
        return res.api(200, "Branch reactivated successfully !!", reactivatedBranch);
      }
      return next(new ApiError(400, `${title} already exists in this location`));
    }

    const branch = new Branch({ title, address, status, zoneId, stateId, cityId });
    const savedBranch = await branch.save();

    return res.api(201, "Branch created successfully !!", savedBranch);
  } catch (err) {
    return next(err);
  }
};

// Get All Branches (populating referenced docs)
export const getAllBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find({ status: "Active" })
      .populate("zoneId", "zoneId title")
      .populate("stateId", "stateId title")
      .populate("cityId", "cityId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Branches fetched successfully !!", branches);
  } catch (err) {
    return next(err);
  }
};

// Get Branch by ID (populating referenced docs)
export const getBranchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    const branch = await Branch.findOne({ _id: id, status: "Active" })
      .populate("zoneId", "zoneId title")
      .populate("stateId", "stateId title")
      .populate("cityId", "cityId title");

    if (!branch) {
      return next(new ApiError(404, "Branch not found or inactive"));
    }

    return res.api(200, "Branch fetched successfully !!", branch);
  } catch (err) {
    return next(err);
  }
};

// Update Branch with existence checks
export const updateBranch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, zoneId, stateId, cityId } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    if (zoneId) await checkReferenceExists(Zone, zoneId, "Zone");
    if (stateId) await checkReferenceExists(State, stateId, "State");
    if (cityId) await checkReferenceExists(City, cityId, "City");

    if (title || zoneId || stateId || cityId) {
      const existing = await Branch.findOne({
        title: title ? title.trim() : undefined,
        zoneId: zoneId || undefined,
        stateId: stateId || undefined,
        cityId: cityId || undefined,
        _id: { $ne: id },
      });

      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivatedBranch = await existing.save();
          return res.api(200, "Branch reactivated successfully !!", reactivatedBranch);
        }
        return next(new ApiError(400, "Branch title already exists in this location"));
      }
    }

    const branch = await Branch.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("zoneId", "zoneId title")
      .populate("stateId", "stateId title")
      .populate("cityId", "cityId title");

    if (!branch) {
      return next(new ApiError(404, "Branch not found or inactive"));
    }

    return res.api(200, "Branch updated successfully !!", branch);
  } catch (err) {
    return next(err);
  }
};

// Soft Delete Branch
export const softDeleteBranch = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    const branch = await Branch.findByIdAndUpdate(id, { status: "Inactive" }, { new: true });

    if (!branch) {
      return next(new ApiError(404, "Branch not found"));
    }

    return res.api(200, "Branch soft deleted (Inactive) successfully !!", branch);
  } catch (err) {
    return next(err);
  }
};

// Permanently Delete Branch
export const deleteBranchPermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    const branch = await Branch.findByIdAndDelete(id);

    if (!branch) {
      return next(new ApiError(404, "Branch not found"));
    }

    return res.api(200, "Branch permanently deleted successfully !!", branch);
  } catch (err) {
    return next(err);
  }
};

// Get Branches by City ID with populated details
export const getBranchesByCityId = async (req, res, next) => {
  try {
    const { id } = req.params;

    await checkReferenceExists(City, id, "City");

    const branches = await Branch.find({ cityId:id, status: "Active" })
      .populate("zoneId", "zoneId title")
      .populate("stateId", "stateId title")
      .populate("cityId", "cityId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Branches fetched successfully for given city !!", branches);
  } catch (err) {
    return next(err);
  }
};
