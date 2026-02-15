import mongoose from "mongoose";

/* ---------------- FILE OBJECT ---------------- */
export const fileObjectSchema = new mongoose.Schema(
  {
    public_id: String,
    public_url: String,
    url: String,
    name: String,
    type: String, // image | video | audio | pdf etc
  },
  { _id: false },
);

/* ---------------- SIZE SPECIFICATION ---------------- */
export const sizeSpecificationSchema = new mongoose.Schema(
  {
    width_in_inch: {
      type: Number,
      default: null,
    },
    height_in_inch: {
      type: Number,
      default: null,
    },
    thickness_in_mm: {
      type: Number,
      default: null,
    },
  },
  { _id: false },
);

export const approvalPanelSchema = new mongoose.Schema(
  {
    //  Selected Design Option ID
    design_option_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
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
export const designOptionItemSchema = new mongoose.Schema(
  {
    option_number: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    font_name: {
      type: String,
      default: "",
      trim: true,
    },

    upload_design_option: {
      type: fileObjectSchema,
      default: null,
    },

    upload_supporting_asset: {
      type: fileObjectSchema,
      default: null,
    },

    colors_name: {
      type: String,
      default: "",
      trim: true,
    },

    lit_colors_name: {
      type: String,
      default: "",
      trim: true,
    },

    size_specification: {
      type: sizeSpecificationSchema,
      default: {},
    },

    remark: {
      type: String,
      default: "",
    },

    media: {
      type: [fileObjectSchema],
      default: [],
    },
  },
  { _id: true },
);

/* ---------------- MAIN SCHEMA ---------------- */
const DesignOptionsSchema = new mongoose.Schema(
  {
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

    designoptions: {
      type: [designOptionItemSchema],
      default: [],
    },

    /* -------- OVERALL STATUS -------- */
    approval_panel: {
      type: approvalPanelSchema,
      default: {},
    },

    is_active: {
      type: Boolean,
      default: true,
    },
    is_version_started: {
      type: Boolean,
      default: false,
    },
    mark_as_mockup_started: {
      type: Boolean,
      default: false,
    },
    mockup_uploaded: {
      type: Boolean,
      default: false,
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
DesignOptionsSchema.index({
  design_request_id: 1,
  design_assigned_id: 1,
});

DesignOptionsSchema.index({
  design_assigned_id: 1,
  is_version_started: 1,
  is_active: 1,
  "approval_panel.send_to_manager": 1,
  "approval_panel.manager_status": 1,
});

export const DesignOptionsModel = mongoose.model(
  "DesignOptionsModel",
  DesignOptionsSchema,
);
