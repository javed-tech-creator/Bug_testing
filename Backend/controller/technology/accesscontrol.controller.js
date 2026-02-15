import dataAccessControl from "../../models/technology/accesscontrol.model.js";
import ApiError from "../../utils/master/ApiError.js";

//  Create Access (Only Admin can create)
// Create Access Record
export const createAccess = async (req, res, next) => {
  try {
    const newAccess = new dataAccessControl(req.body);
    await newAccess.save();

    return res
      .status(201)
      .json({ success: true, message: "Access record created", data: newAccess });
  } catch (error) {
    next(error);
  }
};

//  Get All Access Records (Admin can see all, Editor only partial, Viewer only own)
export const getAccessRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;   // default page = 1
    const limit = parseInt(req.query.limit, 10) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    let query = {};
    let projection;


    if (req.user.role === "Manager" || req.user.role === "techManager") {
      projection = {};
    } else if (req.user.role === "Editor") {
      query = {};
      projection = "employeeId systemAccess role status"; // Editor sees limited fields
    } else if (req.user.role === "Viewer") {
      query = { employeeId: req.user.employeeId }; // Viewer sees only his own record
      projection = {};
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Permission denied" });
    }

    const records = await dataAccessControl
      .find(query, projection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await dataAccessControl.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Successfully fetched",
      count: records.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//  Update Access Record (Admin can update any, Editor limited, Viewer cannot)
// Update Access Record
export const updateAccess = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updated = await dataAccessControl.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true, // ensure validation during update
    });

    if (!updated) {
             return next(new ApiError(404, "Access record  not found"));
    }

    return res
      .status(200)
      .json({ success: true, message: "Access updated successfully", data: updated });
  } catch (error) {
    next(error);
  }
};

//  Patch AccessRevoked & Auto Status
export const revokeAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { accessRevoked } = req.body;

    // status decide karna backend se
    let status = "Active";
    if (accessRevoked) {
      status = "Inactive";
    }

    const updated = await dataAccessControl.findByIdAndUpdate(
      id,
      { accessRevoked: accessRevoked || null, status },
      { 
        new: true, 
        runValidators: true, // important for validators
        context: "query"       // ensures custom validators run
      }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.status(200).json({
      success: true,
      message: accessRevoked
        ? "Access revoked successfully"
        : "Access re-activated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Revoke Access Error:", error);

    let errorMessage = "Something went wrong";

    // Validation error → sirf first message
    if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)[0].message;
    }
    // Invalid ObjectId
    else if (error.name === "CastError") {
      errorMessage = `Invalid ${error.path}: ${error.value}`;
    }

    return res.status(400).json({ success: false, message: errorMessage });
  }
};



//  Delete Access Record (Only Admin)
export const deleteAccess = async (req, res) => {
  try {

    const { id } = req.params;
    const deleted = await dataAccessControl.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({success:false, message: "Record not found" });

    res.status(200).json({success:true, message: "Access deleted" });
  } catch (error) {
    res.status(500).json({ success:false, message: error.message });
  }
};
