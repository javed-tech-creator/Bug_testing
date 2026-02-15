import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFiles = async (files = []) => {
  try {
    const results = [];

    for (const file of files) {
      let uploadedUrl = null;
      let uploadedId = null;

      // Cloudinary active
      if (process.env.USE_CLOUDINARY === "true") {
        // Case 1: Upload buffer (PDF)
        if (file.buffer) {
          const uploadRes = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
                resource_type: "raw",
                public_id: file.originalname.replace(".pdf", ""),
              },
              (err, result) => {
                if (err) return reject(err);
                resolve(result);
              }
            ).end(file.buffer);
          });

          uploadedUrl = uploadRes.secure_url;
          uploadedId = uploadRes.public_id;
        }

        // Case 2: Upload normal file from path (multer)
        else if (file.path) {
          const uploadRes = await cloudinary.uploader.upload(file.path, {
            folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
            resource_type: "auto",
          });

          uploadedUrl = uploadRes.secure_url;
          uploadedId = uploadRes.public_id;

          if (process.env.DELETE_LOCAL_FILE === "true") {
            fs.unlink(file.path, () => {});
          }
        }
      }

      results.push({
        url: uploadedUrl,
        public_url: uploadedUrl,
        public_id: uploadedId,
      });
    }

    return { success: true, files: results };
  } catch (err) {
    console.error("File upload failed:", err);
    return { success: false, error: err.message };
  }
};


export const deleteFile = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary file deleted:", publicId, result);
    return null;
  } catch (err) {
    console.error("Error deleting file from Cloudinary:", err.message);
    return null;
  }
};

export const deleteLocalFile = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const absolutePath = path.resolve(filePath);

      if (fs.existsSync(absolutePath)) {
        fs.unlink(absolutePath, (err) => {
          if (err) {
            console.error("Error deleting local file:", err);
            return reject(err);
          }
          console.log("Deleted local file:", absolutePath);
          resolve(true);
        });
      } else {
        resolve(true); // File already removed
      }
    } catch (err) {
      console.error("Error deleting local file:", err);
      reject(err);
    }
  });
};
