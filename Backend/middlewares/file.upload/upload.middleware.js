import cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";

export const uploadFilesToCloudinary = async (files, folderName = "client-briefings") => {
  const uploadedFiles = [];

  const MAX_SIZES = {
    image: 2 * 1024 * 1024,  // 1 MB
    pdf: 4 * 1024 * 1024,    // 4 MB
    video: 5 * 1024 * 1024,  // 5 MB
  };

  for (const file of files) {
    const { mimetype, size } = file;
    let typeCategory;

    

    if (mimetype.startsWith("image/")) {
      typeCategory = "image";
    } else if (mimetype === "application/pdf") {
      typeCategory = "pdf";
    } else if (mimetype.startsWith("video/")) {
      typeCategory = "video";
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }

    if (size > MAX_SIZES[typeCategory]) {
      throw new Error(`${typeCategory.toUpperCase()} size should not exceed ${MAX_SIZES[typeCategory] / (1024 * 1024)} MB`);
    }

    const base64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${mimetype};base64,${base64}`;

    const uniqueName = `${uuidv4()}-${file.originalname}`.replace(/\s+/g, "_");

    const uploaded = await cloudinary.v2.uploader.upload(dataURI, {
      folder: folderName,
      public_id: uniqueName,
      resource_type: typeCategory === "video" ? "video" :
                      typeCategory === "pdf" ? "raw" : "image",
      type: "upload",
    });

    uploadedFiles.push({
      url: uploaded.secure_url,
      public_id: uploaded.public_id,
    });
  }

  return uploadedFiles;
};
