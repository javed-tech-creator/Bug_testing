import mongoose, { model } from "mongoose";
import {
  fileObjectSchema,
  sizeSpecificationSchema,
} from "./designOptions.model.js";

const approvalPanelSchema = new mongoose.Schema({
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
});

const designOptionVersionItemSchema = new mongoose.Schema(
  {
    version_number: {
      type: Number,
      required: true,
    },

    send_to_manager: {
      type: Boolean,
      default: false,
    },
    send_to_manager_date: {
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

    approval_panel: {
      type: approvalPanelSchema,
      required: true,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const designOptionVersionSchema = new mongoose.Schema(
  {
    design_option_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignOptionsModel",
      required: true,
      index: true,
    },
    design_option_selected_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    design_option_versions: {
      type: [designOptionVersionItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

designOptionVersionSchema.index(
  { design_option_id: 1, design_option_selected_id: 1 },
  { unique: true },
);

const designOptionVersionModel = mongoose.model(
  "designOptionVersionModel",
  designOptionVersionSchema,
);
export default designOptionVersionModel;
