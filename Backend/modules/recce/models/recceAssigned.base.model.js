import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "assignment_type",
  timestamps: true,
};

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

const clientInteractionHistorySchema = new mongoose.Schema(
  {
    met_client_on_site: {
      type: Boolean,
      required: true,
    },

    reason_for_not_meeting: {
      type: String,
      default: "",
    },

    upload_proof: fileObjectSchema,

    reschedule_date: {
      type: Date,
      default: null,
    },

    person_met: {
      type: String,
      default: "",
    },

    contact_number: {
      type: String,
      default: "",
    },

    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const RecceAssignedBaseSchema = new mongoose.Schema(
  {
    recce_detail_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecceDetail",
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

    recce_manager_comment: {
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

    //  Current Data
    client_interaction: {
      met_client_on_site: {
        type: Boolean,
        required: true,
      },

      reason_for_not_meeting: {
        type: String,
        default: "",
      },

      upload_proof: fileObjectSchema,

      reschedule_date: {
        type: Date,
        default: null,
      },

      person_met: {
        type: String,
        default: "",
      },

      contact_number: {
        type: String,
        default: "",
      },
    },

    //  History Maintain Here
    client_interaction_history: [clientInteractionHistorySchema],

    mark_as_recce_started: {
      type: Boolean,
      default: false,
    },
    recce_started_at: {
      type: Date,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  baseOptions,
);

RecceAssignedBaseSchema.index({ recce_detail_id: 1, is_active: 1 });
RecceAssignedBaseSchema.index({
  assignment_type: 1,
  assigned_to: 1,
  mark_as_started: 1,
  "feedback_panel.final_decision": 1,
  is_active: 1,
  createdAt: -1,
});

// For workflow design options upload pending table
RecceAssignedBaseSchema.index({
  assigned_to: 1,
  is_active: 1,
  mark_as_started: 1,
});

// for search manager for their approval design option
RecceAssignedBaseSchema.index({
  assigned_by: 1,
  assignment_type: 1,
  recce_manager_comment: 1,
  mark_as_started: 1,
  is_active: 1,
});

// DesignAssigned
RecceAssignedBaseSchema.index({
  recce_detail_id: 1,
  is_active: 1,
  work_status: 1,
});

export const RecceAssigned = mongoose.model(
  "RecceAssigned",
  RecceAssignedBaseSchema,
);
