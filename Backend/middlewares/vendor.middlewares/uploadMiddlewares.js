import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Storage for profile images
const profileImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vendor_profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "fill" }],
  },
});

// Storage for contract files (PDF only)
const contractStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vendor_contracts",
    allowed_formats: ["pdf"],
  },
});

export const uploadProfileImage = multer({ storage: profileImageStorage });
export const uploadContractFile = multer({ storage: contractStorage });
