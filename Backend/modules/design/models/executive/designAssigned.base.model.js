import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "assignment_type",
  timestamps: true,
};

const DesignAssignedBaseSchema = new mongoose.Schema(
  {
    design_request_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignRequested",
      required: true,
    },

    assignment_type: {
      type: String,
      enum: ["self", "executive"],
      required: true,
    },

    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assigned_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    deadline: {
      type: Date,
      default: null,
      validate: {
        validator: (v) => !v || v >= new Date(),
        message: "Deadline cannot be in the past",
      },
    },

    priority_number: {
      type: Number,
      default: 5,
      min: 1,
      max: 19,
    },

    design_manager_comment: {
      type: String,
      trim: true,
      default: "",
    },

    is_active: {
      type: Boolean,
      default: true,
    },
    work_status: {
      type: String,
      enum: [
        "on_track",
        "postponed_by_company",
        "postponed_by_client",
        "hold_by_company",
        "hold_by_client",
        "rejected_by_client",
        "rejected_by_company",
      ],
      default: "on_track",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    work_remark: {
      type: String,
      trim: true,
      default: "",
    },

    work_status_history: [
      {
        work_status: {
          type: String,
          enum: [
            "on_track",
            "postponed_by_company",
            "postponed_by_client",
            "hold_by_company",
            "hold_by_client",
            "rejected_by_company",
            "rejected_by_client",
          ],
          default: "on_track",
        },
        plan_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        plan_at: {
          type: Date,
          default: Date.now,
        },
        urgency: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        work_remark: {
          type: String,
          trim: true,
          default: "",
        },

        deadline: {
          type: Date,
          default: null,
          validate: {
            validator: (v) => !v || v >= new Date(),
            message: "Deadline cannot be in the past",
          },
        },
      },
    ],

    current_plan: {
      planned_for_date: {
        type: Date,
        default: null,
      },
      planned_slot: {
        type: String,
        enum: ["5_pm", "8_pm", "10_30_am"],
        default: "5_pm",
      },

      planned_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      planned_at: {
        type: Date,
        default: null,
      },

      approval_status: {
        type: String,
        enum: ["waiting_for_acceptance", "accepted", "declined"],
        default: "waiting_for_acceptance",
      },
      remark: {
        type: String,
        trim: true,
        default: "",
      },
      approval_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      approval_at: {
        type: Date,
        default: null,
      },
    },

    planning_history: [
      {
        planned_for_date: {
          type: Date,
          default: null,
        },
        planned_slot: {
          type: String,
          enum: ["5_pm", "8_pm", "10_30_am"],
          default: "5_pm",
        },

        planned_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        planned_at: {
          type: Date,
          default: null,
        },

        approval_status: {
          type: String,
          enum: ["pending", "accepted", "declined"],
          default: "pending",
        },

        approval_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        approval_at: {
          type: Date,
          default: null,
        },

        remark: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    de_assigned_at: {
      type: Date,
      default: null,
    },
    de_assigned_remark: {
      type: String,
      trim: true,
      default: "",
    },
    is_reassigned: {
      type: Boolean,
      default: false,
    },

    is_reassigned_from_next_day_planning: {
      type: Boolean,
      default: false,
    },
    remark: {
      type: String,
      trim: true,
      default: "",
    },

    mark_as_started: {
      type: Boolean,
      default: false,
    },
    started_at: {
      type: Date,
      default: null,
    },
    design_option_uploaded: {
      type: Boolean,
      default: false,
    },

    design_option_uploaded_at: {
      type: Date,
      default: null,
    },
    mark_as_mockup_started: {
      type: Boolean,
      default: false,
    },
    mockup_started_at: {
      type: Date,
      default: null,
    },

    mark_as_measurement_started: {
      type: Boolean,
      default: false,
    },
    measurement_started_at: {
      type: Date,
      default: null,
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
  baseOptions,
);

DesignAssignedBaseSchema.index({ design_request_id: 1, is_active: 1 });
DesignAssignedBaseSchema.index({
  assignment_type: 1,
  assigned_to: 1,
  mark_as_started: 1,
  "feedback_panel.final_decision": 1,
  is_active: 1,
  createdAt: -1,
});

// For workflow design options upload pending table
DesignAssignedBaseSchema.index({
  assigned_to: 1,
  is_active: 1,
  mark_as_started: 1,
  design_option_uploaded: 1,
});

// for search manager for their approval design option
DesignAssignedBaseSchema.index({
  assigned_by: 1,
  assignment_type: 1,
  design_option_uploaded: 1,
  mark_as_mockup_started: 1,
  is_active: 1,
});

// DesignAssigned
DesignAssignedBaseSchema.index({
  design_request_id: 1,
  is_active: 1,
  work_status: 1,
});

export const DesignAssigned = mongoose.model(
  "DesignAssigned",
  DesignAssignedBaseSchema,
);
