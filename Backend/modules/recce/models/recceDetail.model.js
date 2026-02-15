import mongoose, { Schema } from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.set("autoIndex", false);

export const remarkSchema = {
  rating: { type: Number, trim: true, default: null },
  title: { type: String, default: "" },
  remark: { type: String, default: "" },
};

export const feedbackSchema = {
  recceRemark: { type: String, default: "" },
  remarkRating: { type: Number, default: null },

  finalDecision: {
    type: String,
    enum: ["accepted", "decline", "flag", "pending"],
    default: "pending",
  },

  declineRemark: { type: String, default: "" },

  flagType: {
    type: String,
    enum: ["blue", "yellow", "red", ""],
    default: "",
  },

  flagRemark: { type: String, default: "" },
};

const executiveDesignRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    remark: {
      type: String,
      required: true,
      trim: true,
    },

    requested_at: {
      type: Date,
      default: Date.now, // ✅ server se automatic date
    },
  },
  { _id: true },
);

const assignedExecutiveSchema = new mongoose.Schema({
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  assigned_recce_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RecceAssigned",
    default: null,
  },
  assign_date: {
    type: Date,
    default: null,
  },
});

const recceDetailSchema = new Schema(
  {
    projectId: {
      type: ObjectId,
      ref: "Project",
      required: true,
    },

    clientId: {
      type: ObjectId,
      ref: "Client",
      required: false,
    },
    
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    projectComments: {
      type: String,
      trim: true,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    send_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    received_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    recceComment: {
      type: String,
      trim: true,
      default: null,
    },
    remarkScore: {
      type: String,
      trim: true,
      default: null,
    },

    basicClientRemark: { type: remarkSchema, default: () => ({}) },
    projectInformationRemark: { type: remarkSchema, default: () => ({}) },
    sideAddressRemark: { type: remarkSchema, default: () => ({}) },
    designAssetsRemark: { type: remarkSchema, default: () => ({}) },
    reccefeedback: { type: remarkSchema, default: () => ({}) },
    receiving_checklist: {
      type: [String], //  SIMPLE ARRAY
      default: [],
    },
    feedback_panel: { type: feedbackSchema, default: () => ({}) },

    user_assignment_requests: {
      type: [executiveDesignRequestSchema],
      default: [],
    },

    current_assigned_executive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    current_recce_assigned_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecceAssigned",
      default: null,
    },
    assigned_executives: {
      type: [assignedExecutiveSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const RecceDetail = mongoose.model("RecceDetail", recceDetailSchema);
export default RecceDetail;
