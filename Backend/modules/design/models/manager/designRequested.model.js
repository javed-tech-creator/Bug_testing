import mongoose from "mongoose";
import {
  feedbackSchema,
  remarkSchema,
} from "../common_schema/commonSubschema.model.js";
import { assignedExecutiveSchema } from "../executive/design_requested/designRequestedExecutive.js";
import AutoIncrementFactory from "mongoose-sequence";
import { executiveDesignRequestSchema } from "../executive/executiveDesignRequested.model.js";

const AutoIncrement = AutoIncrementFactory(mongoose);

const DesignRequestedSchema = new mongoose.Schema(
  {
    design_id: {
      type: String,
      unique: true,
    },
    sequence_value: {
      type: Number, //  REQUIRED for mongoose-sequence
    },
    recce_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DummyRecce",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientProduct",
      required: true,
    },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
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

    received_date: {
      type: Date,
      default: null, //  initially null rahegi
    },

    environmental_conditions: { type: remarkSchema, default: () => ({}) },
    product_requirements_remark: { type: remarkSchema, default: () => ({}) },
    upload_photos_remark: { type: remarkSchema, default: () => ({}) },
    upload_videos_remark: { type: remarkSchema, default: () => ({}) },
    installation_details_remark: { type: remarkSchema, default: () => ({}) },
    raw_recce_remark: { type: remarkSchema, default: () => ({}) },
    data_from_client_remark: { type: remarkSchema, default: () => ({}) },
    additional_instruction_remark: { type: remarkSchema, default: () => ({}) },
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
    current_design_assigned_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignAssigned",
      default: null,
    },
    assigned_executives: {
      type: [assignedExecutiveSchema],
      default: [],
    },
    mark_as_started: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //  createdAt & updatedAt auto
  },
);         

DesignRequestedSchema.plugin(AutoIncrement, {
  id: "design_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

DesignRequestedSchema.post("save", async function (doc, next) {
  try {
    if (!doc.design_id) {
      const year = new Date().getFullYear().toString().slice(-2);
      const padded = String(this.sequence_value).padStart(4, "0");
      const generatedId = `DGN-${year}${padded}`;
      await doc.constructor.findByIdAndUpdate(doc._id, {
        design_id: generatedId,
      });
      doc.design_id = generatedId;
    }
    next();
  } catch (err) {
    next(err);
  }
});

DesignRequestedSchema.index({ design_id: 1 });
DesignRequestedSchema.index({ recce_id: 1 });
DesignRequestedSchema.index({
  branch_id: 1,
  mark_as_started: 1,
  "feedback_panel.final_decision": 1,
});


// DesignRequested
DesignRequestedSchema.index({
  client_id: 1,
  "feedback_panel.final_decision": 1,
});

DesignRequestedSchema.index({ createdAt: -1 });

const DesignRequested = mongoose.model(
  "DesignRequested",
  DesignRequestedSchema,
);

export default DesignRequested;
