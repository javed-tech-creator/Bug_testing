import mongoose from "mongoose";
import { remarkSchema } from "./commonSubschema.model.js";

const measurementChecklistSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      required: true,
    },
    is_checked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const feedbackSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      default: null,
    },

    final_decision: {
      type: String,
      enum: ["approve", "flag", "pending"],
      default: "pending",
    },

    remark: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const measurementSubmissionSchema = new mongoose.Schema(
  {
    /* ------------ RELATION ------------ */
    measurement_quotation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignMeasurementVersion",
      required: true,
      index: true,
    },

    /* ------------ EXECUTIVE PART ------------ */
    executive_submission: {
      checklist: {
        type: [measurementChecklistSchema],
        default: [],
      },

      declaration: {
        type: Boolean,
        default: false,
      },

      submitted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      submitted_at: {
        type: Date,
        default: null,
      },
      rating: {
        type: Number,
        default: null,
      },
      remark: {
        type: String,
        default: "",
      },
    },

    /* ------------ MANAGER PART ------------ */
    manager_submission: {
      design_option_remark: { type: remarkSchema, default: () => ({}) },
      design_option_modification_remark: {
        type: remarkSchema,
        default: () => ({}),
      },
      design_mockup_remark: { type: remarkSchema, default: () => ({}) },
      design_measurement_remark: { type: remarkSchema, default: () => ({}) },

      checklist: {
        type: [measurementChecklistSchema],
        default: [],
      },

      declaration: {
        type: Boolean,
        default: false,
      },

      feedback: {
        type: feedbackSchema,
        default: {},
      },

      submitted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      submitted_at: {
        type: Date,
        default: null,
      },
    },

    /* ------------ WORKFLOW STATUS ------------ */
    workflow_status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED_BY_EXECUTIVE",
        "APPROVED_BY_MANAGER",
        "FLAGGED_BY_MANAGER",
      ],
      default: "DRAFT",
      index: true,
    },

    /* ------------ META ------------ */
    is_active: {
      type: Boolean,
      default: true,
    },
    /* ------------ SEND TO QUOTATION DEPARTMENT ------------ */
    send_to_quotation: {
      is_sent: {
        type: Boolean,
        default: false,
        index: true,
      },

      sent_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      sent_at: {
        type: Date,
        default: null,
      },

      remark: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  { timestamps: true },
);

/* =====================================================
   INDEXES
===================================================== */
measurementSubmissionSchema.index({
  measurement_quotation_id: 1,
  workflow_status: 1,
});

measurementSubmissionSchema.index({
  "executive_submission.submitted_by": 1,
});

measurementSubmissionSchema.index({
  "manager_submission.submitted_by": 1,
});

/* =====================================================
   EXPORT MODEL
===================================================== */
export const MeasurementSubmission = mongoose.model(
  "MeasurementSubmission",
  measurementSubmissionSchema,
);
