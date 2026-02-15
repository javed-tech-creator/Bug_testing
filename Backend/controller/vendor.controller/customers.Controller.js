
import vendorCustomerModel from "../../models/vendor.model/customers.Model.js";
import VendorStatsModel from "../../models/vendor.model/vendorStats.Model.js";
import ApiError from "../../utils/master/ApiError.js";

//  Create Customer Profile
export const createCustomerProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      gstin,
      companyName,
      addressLine1,
      addressLine2,
      city,
      pincode,
      state,
      country,
    } = req.body;

      //  Check if customer exists with email OR phone
    const existingCustomer = await vendorCustomerModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists with this email or phone.",
        data: existingCustomer,
      });
    }

    const newProfile = new vendorCustomerModel({
      createdBy: req.user._id, //  Get from logged-in user
      fullName,
      phone,
      email,
      gstin,
      companyName,
      addressLine1,
      addressLine2,
      city,
      pincode,
      state,
      country: country || "India",
    });

    await newProfile.save();

        //  Update Vendor Stats (Increase totalCustomers by 1)
    await VendorStatsModel.findOneAndUpdate(
      { vendorId: req.user._id },
      { $inc: { totalCustomers: 1 } }, // increment by 1
      { upsert: true, new: true } // create if not exists
    );

    res.status(201).json({
      success: true,
      message: "Customer profile created successfully.",
      data: newProfile,
    });
  } catch (error) {
   next(error)
  }
};

//  Get all customer profiles for the logged-in user
export const getCustomerProfiles = async (req, res) => {
  try {
    const profiles = await vendorCustomerModel.find({ createdBy: req.user._id }).sort({ createdAt: -1 }); //  latest first;

    if (!profiles.length) {
             return next(new ApiError(404, "No customer profiles found."));
    }

    res.status(200).json({
      success: true,
      message: "Customer profiles retrieved successfully.",
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving customer details.",
      error: error.message,
    });
  }
};
