import mongoose from "mongoose";

const eventItemSchema = new mongoose.Schema(
  {
    //  Event kab hua (SERVER time only)
    event_at: {
      type: Date,
      default: Date.now,
    },

    //  Kis user ne action kiya
    performed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //  Kis role se action hua
    performed_role: {
      type: String,
      enum: ["manager", "executive", "client", ""],
      default: "",
    },

    //  Action type
    action_type: {
      type: String,
      required: true,
      // enum: [
      //   "design_requested",
      //   "accepted_by_manager",
      //   "flagged_by_manager",
      //   "declined_by_manager",
      //   "design_assigned",
      //   "accepted_by_executive",
      //   "flagged_by_executive",
      //   "declined_by_executive",
      //   "design_started",
      //   "design_option_uploaded",
      //   "design_option_approved",
      //   "design_option_rejected",
      //   "design_option_modified",
      //   "selected_option_version_uploaded",
      //   "modify_approved",
      //   "modify_rejected",
      //   "mockup_started",
      //   "mockup_uploaded",
      //   "mockup_modified",
      //   "mockup_rejected",
      //   "mockup_approved",
      //   "sent_to_manager",
      //   "sent_to_sales",
      //   "sent_to_client",
      //   "quotation_started",
      //   "quotation_sent_to_manager",
      //   "quotation_modify_approved",
      //   "quotation_review_submitted_to_manager",
      //   "manager_reviewed",
      //   "manager_feedback_submitted",
      //   "sent_to_quotation_department",
      // ],
    },

    //  Human readable message
    message: {
      type: String,
      trim: true,
      default: "",
    },

    //  Extra metadata
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }, //  sub-docs ke liye extra _id nahi chahiye
);

const eventLogSchema = new mongoose.Schema(
  {
    //  Static references (ONE TIME)
    design_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignRequested",
      required: true,
      unique: true,
      index: true,
    },

    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientProduct",
      required: true,
      index: true,
    },
    //  All events stored here
    events: {
      type: [eventItemSchema],
      default: [],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

//  Prevent duplicate docs for same product + design
eventLogSchema.index({ product_id: 1, design_id: 1 });

const DesignEventLog = mongoose.model("DesignEventLog", eventLogSchema);
export default DesignEventLog;
