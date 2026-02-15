import mongoose from "mongoose";
import { fileObjectSchema } from "./designOptions.model.js";

const approvalPanelSchema = new mongoose.Schema(
  {
    send_to_manager: {
      type: Boolean,
      default: false,
    },

    send_to_manager_date: {
      type: Date,
      default: null,
    },
    manager_status: {
      type: String,
      enum: [
        "NA",
        "PENDING_BY_MANAGER",
        "APPROVED_BY_MANAGER",
        "MODIFICATION_BY_MANAGER",
        "REJECTED_BY_MANAGER",
      ],
      default: "NA",
    },
    manager_remark: { type: String, default: "" },
    manager_media: {
      type: [fileObjectSchema],
      default: [],
    },
    manager_action_at: {
      type: Date,
      default: null,
    },

    send_to_client: {
      type: Boolean,
      default: false,
    },
    send_to_client_date: {
      type: Date,
      default: null,
    },

    client_status: {
      type: String,
      enum: [
        "NA",
        "PENDING_BY_CLIENT",
        "APPROVED_BY_CLIENT",
        "MODIFICATION_BY_CLIENT",
        "REJECTED_BY_CLIENT",
      ],
      default: "NA",
    },
    client_remark: { type: String, default: "" },
    client_media: {
      type: [fileObjectSchema],
      default: [],
    },
    client_action_at: {
      type: Date,
      default: null,
    },
  },
  { _id: false },
);
/* ---------------- DESIGN OPTION ITEM ---------------- */
const designMockupItemSchema = new mongoose.Schema(
  {
    version_number: {
      type: Number,
      required: true,
    },

    upload_mockup_version: {
      type: fileObjectSchema,
      required: true, // single file mandatory
      default: null,
    },

    upload_supporting_asset: {
      type: fileObjectSchema,
      default: null, // optional single file
    },

    media: {
      type: [fileObjectSchema], // multiple files
      default: [],
    },

    /* ------------ META ------------ */
    remark: {
      type: String,
      trim: true,
      default: "",
    },

    uploaded_at: {
      type: Date,
      default: Date.now,
    },

    approval_panel: {
      type: approvalPanelSchema,
      default: {},
    },
  },
  { _id: true },
);

/* ---------------- MAIN SCHEMA ---------------- */
const DesignMockupVersionSchema = new mongoose.Schema(
  {
    /* ------------ RELATIONS ------------ */
    design_option_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignOptionsModel",
      required: true,
      index: true,
    },

    design_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignRequested",
      required: true,
      index: true,
    },

    design_assigned_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignAssigned",
      required: true,
      index: true,
    },

    /* ------------ FILE UPLOADS ------------ */

    designmockupVersion: {
      type: [designMockupItemSchema],
      default: [],
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mark_as_measurement_started: {
      type: Boolean,
      default: false,
    },
    measurement_uploaded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/* ---------------- INDEXES ---------------- */
DesignMockupVersionSchema.index({
  design_options_id: 1,
  design_option_id: 1,
  is_active: 1,
});

// DesignMockupVersion
DesignMockupVersionSchema.index({
  is_active: 1,
  mark_as_measurement_started: 1,
  "designmockupVersion.approval_panel.send_to_client": 1,
});

export const DesignMockupVersionModel = mongoose.model(
  "DesignMockupVersion",
  DesignMockupVersionSchema,
);
