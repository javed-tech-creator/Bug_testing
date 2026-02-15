import mongoose from "mongoose";

const accessSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    systemAccess: {
      type: [String], // ["Email", "CRM", "ERP"]
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Editor", "Viewer"],
    },
    loginHistory: {
      type: String, // Could also be Array if you want multiple logs
      required: true,
      trim: true,
    },
    deviceBinding: {
      type: String,
      required: true,
      enum: ["Laptop", "Phone", "Tablet"], // only allowed devices
    },
    accessRevoked: {
      type: Date, // null if active, date if revoked
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true; // null allowed

          const today = new Date();
          today.setHours(0, 0, 0, 0); // aaj ka start time

          const revokedDate = new Date(value);
          revokedDate.setHours(0, 0, 0, 0); // input date ka start time

          return revokedDate <= today; // aaj ya past ki date hi valid
        },
        message: "Access revoked date cannot be in the future",
      },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const dataAccessControl = mongoose.model("Access", accessSchema);
export default dataAccessControl;
