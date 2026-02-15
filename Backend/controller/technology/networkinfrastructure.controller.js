import networkInfrastructureModel from "../../models/technology/networkInfrastructure.model.js";
import ApiError from "../../utils/master/ApiError.js";


//  Add Device
// Add Device
export const addDevice = async (req, res, next) => {
  try {
    if (req.body.deviceId) {
      req.body.deviceId = req.body.deviceId.toLowerCase();
    }

    const device = new networkInfrastructureModel(req.body);
    await device.save();
    return res
      .status(201)
      .json({ success: true, message: "Device added successfully", data: device });
  } catch (error) {
    next(error);
  }
};

//  Get All Devices
export const getDevices = async (req, res) => {
  try {
   const page = parseInt(req.query.page, 10) || 1;   // default page = 1
    const limit = parseInt(req.query.limit, 10) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    // Total count of documents
    const total = await networkInfrastructureModel.countDocuments();

    // Apply pagination
    const devices = await networkInfrastructureModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: devices,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//  Get Device by ID
export const getDeviceById = async (req, res) => {
  try {
    const device = await networkInfrastructureModel.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }
    return res.status(200).json({ success: true, data: device });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Update Device
export const updateDevice = async (req, res, next) => {
  try {
    if (req.body.deviceId) {
      req.body.deviceId = req.body.deviceId.toLowerCase();
    }

    const device = await networkInfrastructureModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!device) {
          return next(new ApiError(404, "Device not found"));
      
    }

    return res
      .status(200)
      .json({ success: true, message: "Device updated successfully", data: device });
  } catch (error) {
   next(error);
  }
};

//  Delete Device
export const deleteDevice = async (req, res) => {
  try {
    const device = await networkInfrastructureModel.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }
    return res.status(200).json({ success: true, message: "Device deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
