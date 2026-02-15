import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
       lowercase: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    services: {
      type: String,
      required: true,
      enum: ["AMC", "Network", "Server", "Cloud"],
    },
   contactName: {
        type: String,
        required: true,
        trim: true,
      },
      contactPhone: {
        type: String,
        required: true, 
        match: [/^[0-9]{10}$/, "Invalid phone number"],
      },
      contactEmail: {
        type: String,
        required: true, 
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
   contractStart: {
  type: Date,
  required: [true, "Contract start date is required"],
  validate: {
    validator: function (value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // sirf date compare karne ke liye
      return value <= today; // aaj ya past ki date valid
    },
    message: "Contract start date cannot be in the future",
  },
},

    contractEnd: {
      type: Date,
      required: true,
      validate: {
        validator: function (end) {
          return !this.contractStart || end >= this.contractStart;
        },
        message: "Contract end date must be after start date",
      },
    },
    renewalTerms: {
      type: String,
      required: true,
    },
    slaCommitments: {
      type: String,
      required: true,
    },
    serviceLogs: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

const VendorManagementModel = mongoose.model("VendorManagement", vendorSchema);
export default VendorManagementModel;
