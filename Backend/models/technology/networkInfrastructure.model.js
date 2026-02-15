// models/device.model.js
import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
        lowercase: true,
    },
    deviceType: {
      type: String,
      required: true,
      enum: ["Switch", "Router", "Firewall", "Access Point", "CCTV", "Server"],
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
        "Invalid IP address",
      ],
    },
    macAddress: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
        "Invalid MAC address",
      ],
    },
    configurationDetails: {
      type: String,
      required: true,
      trim: true,
    },
    installedLocation: {
      type: String,
      required: true,
      trim: true,
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
    },
    maintenanceHistory: {
      type: String,
      // required: true,
      trim: true,
    },
    nextServiceDue: {
  type: Date,
  required: [true, "Next service due date is required"],
  validate: {
    validator: function (value) {
      if (!value) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // sirf date part compare karne ke liye
      return value >= today; // aaj ya future ki date hi valid hai
    },
    message: "Next service due date cannot be in the past",
  },
   isDeleted: {
    type: Boolean,
    default: false,
  },

},

  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

 const networkInfrastructureModel = mongoose.model("Device", deviceSchema);
 export default networkInfrastructureModel;
