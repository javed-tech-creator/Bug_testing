import mongoose from "mongoose";
// import VendorProfile from "../../models/vendor.model/profiledata.Model.js";
import VendorProfile from "../../modules/admin/models/vendor.model.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { log } from "console";

//  Create Vendor Profile
// export const createVendorProfile = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     // Prevent duplicate
//     const existingProfile = await VendorProfile.findOne({ userId });
//     if (existingProfile) {
//       return res.status(400).json({
//         success: false,
//         message: "Profile already exists for this user.",
//       });
//     }

//     // Attach uploaded files if provided
//     // if (req.files?.profileImage?.[0]) {
//     //   req.body.profileImage = {
//     //     fileName: req.files.profileImage[0].originalname,
//     //     fileUrl: req.files.profileImage[0].path,
//     //   };
//     // }
//     if (req.files?.contractForm?.[0]) {
//       req.body.contractForm = {
//         fileName: req.files.contractForm[0].originalname,
//         fileUrl: req.files.contractForm[0].path,
//       };
//     }

//     const newProfile = new VendorProfile(req.body);
//     await newProfile.save();

//     res.status(201).json({
//       success: true,
//       message: "Vendor profile created successfully.",
//       data: newProfile,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error creating vendor profile.",
//       error: error.message,
//     });
//   }
// };



export const getVendorProfile = async (req, res) => {
  try {
    const userId = req.userProfileId; //  middleware se 

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required to fetch vendor profile.",
      });
    }

    // Find by userId
    const profile = await VendorProfile.findOne({ _id: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found.",
      });
    }
console.log("vender profile is ",profile);

    res.status(200).json({
      success: true,
      message: "Vendor profile fetched successfully.",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching vendor profile.",
      error: error.message,
    });
  }
};

//  Update Vendor KYC
export const updateVendorKYC = async (req, res) => {
  try {
    const vendorId =  req.userProfileId; // vendor profile id

    const {
      aadharNumber,
      accountNumber,
      bankName,
      gstNumber,
      ifscCode,
      panNumber,
    } = req.body;

    const updatedData = {
      aadharNumber,
      accountNumber,
      bankName,
      gstNumber,
      ifscCode,
      panNumber,
    };

    // Remove undefined values
    Object.keys(updatedData).forEach(
      (key) => updatedData[key] === undefined && delete updatedData[key]
    );

    const updatedVendor = await VendorProfile.findByIdAndUpdate(
      vendorId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC details updated successfully",
      data: updatedVendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// Update Vendor Profile Image
// export const updateVendorProfileImage = async (req, res) => {
//   const userId = req.user.id; // authMiddleware se user info

//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const vendorProfile = await VendorProfile.findOne({ userId });
//     if (!vendorProfile) {
//       return res.status(404).json({ message: "Vendor profile not found" });
//     }

//     // Delete old image from Cloudinary if exists
//     const oldImageId = vendorProfile.profileImage?.public_id;
//     if (oldImageId) {
//       await cloudinary.uploader.destroy(oldImageId);
//     }

//     // Upload new image
//     const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
//       folder: 'vendor_profile_image',
//       public_id: `profile_image_${Date.now()}`,
//       use_filename: true,
//     });

//     // Remove local file
//     fs.unlinkSync(req.file.path);

//     const updatedVendor = await VendorProfile.findOneAndUpdate(
//       { userId },
//       {
//         profileImage: {
//           public_id: cloudinaryResponse.public_id,
//           fileUrl: cloudinaryResponse.secure_url,
//         },
//       },
//       { new: true }
//     );

//     res.json({
//       message: "Profile image updated successfully",
//       profileImage: updatedVendor.profileImage,
//     });
//   } catch (error) {
//     console.error("Error updating profile image:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    path: "/",
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return res.status(200).json({message:"Logout Succesfull"});
};
