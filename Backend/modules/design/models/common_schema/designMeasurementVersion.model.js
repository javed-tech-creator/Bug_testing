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
  },
  { _id: false },
);
/* ---------------- DESIGN OPTION ITEM ---------------- */
const designMeasurementItemSchema = new mongoose.Schema(
  {
    upload_measuremnet_file: {
      type: fileObjectSchema,
      required: true, // single file mandatory
      default: null,
    },

    upload_supporting_asset: {
      type: fileObjectSchema,
      default: null, // optional single file
    },

    /* ------------ BOARD DETAILS ------------ */
    board: {
      thickness: {
        type: Number,
        required: true,
      },
      length: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
    },

    /* ------------ LETTERS DETAILS ------------ */
    letters: [
      {
        letter: {
          type: String,
          trim: true,
          default: "",
        },
        length: {
          type: Number,
          required: true,
        },
        height: {
          type: Number,
          required: true,
        },
        thickness: {
          type: Number,
          required: true,
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],

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
const DesignMeasurementVersionSchema = new mongoose.Schema(
  {
    /* ------------ RELATIONS ------------ */
    design_mockup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignMockupVersion",
      required: true,
      index: true,
    },

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

    designmeasurementVersion: {
      type: [designMeasurementItemSchema],
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
    mark_as_design_review_started: {
      type: Boolean,
      default: false,
    },
    design_review_started_at: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true,
  },
);

/* ---------------- INDEXES ---------------- */
DesignMeasurementVersionSchema.index({
  design_mockup_id: 1,
  design_assigned_id: 1,
  is_active: 1,
});

// DesignMockupVersion
DesignMeasurementVersionSchema.index({
  is_active: 1,
  mark_as_design_review_started: 1,
  "designmeasurementVersion.approval_panel.send_to_manager": 1,
});

export const DesignMeasurementVersion = mongoose.model(
  "DesignMeasurementVersion",
  DesignMeasurementVersionSchema,
);
