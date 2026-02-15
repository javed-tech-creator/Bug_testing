import fs from "fs";
import SOP from "../../models/onboarding/sop.model.js";
import {
  uploadFiles,
  deleteFile,
  deleteLocalFile,
} from "../../../../utils/master/cloudinary.js";

/* -------------------------------------------------------------------------- */
/* ✅ CREATE SOP */
/* -------------------------------------------------------------------------- */
export const createSOP = async (req, res) => {
  try {
    const { title, description, designationId, uploadedBy } = req.body;
    const files = req.files || [];

    if (!title || !designationId) {
      return res.status(400).json({
        success: false,
        message: "Title and Designation are required fields.",
      });
    }

    // ❗ Check if an SOP already exists for this designation
    const existingSOP = await SOP.findOne({ designationId });
    if (existingSOP) {
      return res.status(400).json({
        success: false,
        message: "An SOP for this designation already exists.",
      });
    }

    const uploadResult = await uploadFiles(files);
    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: "File upload failed",
        error: uploadResult.error,
      });
    }

    const newSOP = await SOP.create({
      title,
      description,
      designationId,
      uploadedBy,
      files: uploadResult.files,
    });

    res.status(201).json({
      success: true,
      message: "SOP created successfully",
      data: newSOP,
    });
  } catch (error) {
    console.error("Error creating SOP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create SOP",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ GET ALL SOPs */
/* -------------------------------------------------------------------------- */
export const getAllSOPs = async (req, res) => {
  try {
    const sops = await SOP.find()
      .populate("designationId", "title")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "SOPs fetched successfully",
      data: sops,
    });
  } catch (error) {
    console.error("Error fetching SOPs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SOPs",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ GET SOP BY ID */
/* -------------------------------------------------------------------------- */
export const getSOPById = async (req, res) => {
  try {
    const { id } = req.params;

    const sop = await SOP.findById(id)
      .populate("designationId", "title")
      .populate("uploadedBy", "name email");

    if (!sop) {
      return res.status(404).json({
        success: false,
        message: "SOP not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SOP fetched successfully",
      data: sop,
    });
  } catch (error) {
    console.error("Error fetching SOP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SOP",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ UPDATE SOP (FINAL) */
/* -------------------------------------------------------------------------- */
export const updateSOP = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, designationId, status } = req.body;

    const sop = await SOP.findById(id);
    if (!sop) {
      return res.status(404).json({
        success: false,
        message: "SOP not found",
      });
    }

    let finalFiles = [...sop.files];

    const newFiles = req.files || [];
    if (newFiles.length > 0) {
      const uploadResult = await uploadFiles(newFiles);

      if (!uploadResult.success) {
        return res.status(400).json({
          success: false,
          message: "File upload failed",
          error: uploadResult.error,
        });
      }

      finalFiles = [...finalFiles, ...uploadResult.files];
    }

    sop.title = title ?? sop.title;
    sop.description = description ?? sop.description;
    sop.designationId = designationId ?? sop.designationId;
    sop.status = status ?? sop.status;
    sop.files = finalFiles;

    await sop.save();

    res.status(200).json({
      success: true,
      message: "SOP updated successfully",
      data: sop,
    });
  } catch (error) {
    console.error("Error updating SOP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update SOP",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ DELETE SOP */
/* -------------------------------------------------------------------------- */
export const deleteSOP = async (req, res) => {
  try {
    const { id } = req.params;
    const sop = await SOP.findById(id);

    if (!sop) {
      return res.status(404).json({
        success: false,
        message: "SOP not found",
      });
    }

    for (const file of sop.files || []) {
      if (file.public_id) {
        await deleteFile(file.public_id);
      } else if (file.url) {
        deleteLocalFile(file.url);
      }
    }

    await SOP.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "SOP deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting SOP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete SOP",
      error: error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ UPDATE SOP STATUS */
/* -------------------------------------------------------------------------- */
export const updateSOPStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Active", "Inactive", "Archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedSOP = await SOP.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSOP) {
      return res.status(404).json({
        success: false,
        message: "SOP not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SOP status updated successfully",
      data: updatedSOP,
    });
  } catch (error) {
    console.error("Error updating SOP status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update SOP status",
      error: error.message,
    });
  }
};
/* -------------------------------------------------------------------------- */
/* ✅ GET SOP BY DESIGNATION ID */
/* -------------------------------------------------------------------------- */
export const getSOPByDesignationId = async (req, res) => {
  try {
    const { designationId } = req.params;

    if (!designationId) {
      return res.status(400).json({
        success: false,
        message: "Designation ID is required",
      });
    }

    const sop = await SOP.findOne({ designationId })
      .populate("designationId", "title")
      .populate("uploadedBy", "name email");

    if (!sop) {
      return res.status(404).json({
        success: false,
        message: "No SOP found for this designation",
      });
    }

    res.status(200).json({
      success: true,
      message: "SOP fetched successfully",
      data: sop,
    });
  } catch (error) {
    console.error("Error fetching SOP by designation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch SOP",
      error: error.message,
    });
  }
};
/* -------------------------------------------------------------------------- */
/* ✅ DELETE A SINGLE FILE FROM SOP */
/* -------------------------------------------------------------------------- */
export const deleteSopFile = async (req, res) => {
  try {
    const { sopId, fileId } = req.params;

    const sop = await SOP.findById(sopId);
    if (!sop) {
      return res.status(404).json({
        success: false,
        message: "SOP not found",
      });
    }

    const fileIndex = sop.files.findIndex(
      (f) => f._id.toString() === fileId.toString()
    );

    if (fileIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "File not found in SOP",
      });
    }

    const file = sop.files[fileIndex];

    // Delete file
    if (file.public_id) {
      const cloudinaryResponse = await deleteFile(file.public_id);
      console.log("Cloudinary delete response:", cloudinaryResponse);
    } else if (file.url) {
      const path = file.url.replace(process.env.BASE_URL, "");
      if (fs.existsSync(`uploads/${path}`)) {
        fs.unlinkSync(`uploads/${path}`);
      }
    }

    sop.files.splice(fileIndex, 1);
    await sop.save();

    const updatedSop = await SOP.findById(sopId);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      files: updatedSop.files,
    });
  } catch (error) {
    console.error("Error deleting SOP file:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete SOP file",
      error: error.message,
    });
  }
};
