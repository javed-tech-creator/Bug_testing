import mongoose from "mongoose";

export const baseProfileSchema = {
      contactPersonName: {
      type: String,
      trim: true,
      required: [true, "Contact person name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      unique: true,
      match: [/^[0-9]{10}$/, "Invalid contact number"],
      index: true,
    },

    alternateContact: {
      type: String,
      match: [/^[0-9]{10}$/, "Invalid alternate contact number"],
      default: null,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
      index: true,
    },

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Business name must be at least 2 characters long"],
      maxlength: [100, "Business name cannot exceed 100 characters"],
      index: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters long"],
      maxlength: [200, "Address cannot exceed 200 characters"],
    },

    city: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
      index: true,
    },

    state: {
      type: String,
      required: [true, "State name is required"],
      trim: true,
      index: true,
    },

    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      match: [/^[1-9][0-9]{5}$/, "Invalid pincode"],
    },

    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      // unique: false,
      // sparse: true, //  allow multiple null values
      default: null,
      match: [
        /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/,
        "Invalid GST number",
      ],
    },

    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      // unique: true,
      // sparse: true,
      default: null,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"],
    },

    aadharNumber: {
      type: String,
      trim: true,
      match: [/^[0-9]{12}$/, "Invalid Aadhar number"],
      // unique: true,
      // sparse: true,
      default: null,
    },

    bankName: { type: String, trim: true, default: null },

    accountNumber: {
      type: String,
      // unique: true,
      // sparse: true,
      trim: true,
      default: null,
      match: [/^[0-9]{9,18}$/, "Invalid account number"],
    },

    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"],
      // sparse: true,
      default: null,
    },

    profileImage: {
      fileName: { type: String, default: null },
      fileType: { type: String, default: null },
      url: { type: String, default: null },
      public_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },

    contractForm: {
      fileName: { type: String, default: null },
      fileType: { type: String, default: null },
      url: { type: String, default: null },
      public_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },

    additionalDocs: [
      {
        docTitle: {
          type: String,
          trim: true,
          maxlength: [100, "Document title too long"],
        },
        fileName: { type: String, default: null },
        fileType: { type: String, default: null },
        url: { type: String, default: null },
        public_url: { type: String, default: null },
        public_id: { type: String, default: null },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
      index: true,
    },
  };
