// utils/uploadFileToCloudinary.js
import cloudinary from "cloudinary";
import fs from "fs";

export const uploadPDFToCloudinary = async (
  localFilePath,
  folder = "finance_docs"
) => {
  try {
    if (!localFilePath) throw new Error("File path not provided");

    // file extension nikal lo
    const ext = localFilePath.split(".").pop().toLowerCase();

    // default resource_type
    let resourceType = "auto";

    // agar pdf h to raw me bhej do
    if (ext === "pdf") resourceType = "raw";

    const result = await cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: resourceType,
      folder,
      timeout: 60000,
    });

    // local file delete karo (optional)
    fs.unlinkSync(localFilePath);

    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
};
