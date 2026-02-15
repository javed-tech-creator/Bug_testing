import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);
// timeline for status change
const timelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "IN PROGRESS",
        "FOLLOW UP",
        "INTERESTED",
        "NOT INTERESTED",
      ],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    remark: String,
  },
  { _id: false },
);

// assignment tracking
const assignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const followUpSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Call", "Whatsapp", "Email", "SMS"],
      required: true,
    },
    remark: {
      type: String,
      required: true,
    },
    followUpDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    public_url: { type: String, trim: true },
    public_id: { type: String, trim: true },
    type: { type: String, default: null },
    name: { type: String, trim: true, default: null },
  },
  { _id: false },
);

const leadSchema = new mongoose.Schema(
  {
    leadId: { type: String, unique: true, index: true },
    clientName: { type: String, required: false, index: true },
    phone: { type: String, required: true, index: true },
    leadSource: String,
    campaignId: { type: String },
    googleLocation: { type: String },
    contactPersonName: { type: String },
    contactPersonEmail: { type: String },
    contactPersonPhone: { type: String },
    contactPersonAltPhone: { type: String },
    contactPersonWhatsapp: { type: String },
    clientDesignation: { type: String },
    altPhone: { type: String },
    whatsapp: { type: String },
    leadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dealBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    relationshipManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    leadLabel: {
      type: String,
      enum: ["UNTOUCHED", "HOT", "WARM", "COLD"],
      default: "UNTOUCHED",
    },
    leadType: {
      type: String,
      enum: ["REPEAT", "FRESH"],
      default: "FRESH",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: function () {
        return this.leadType === "REPEAT";
      },
      default: null,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },

    companyName: String,
    designation: String,
    businessType: String,
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    altPhone: String,
    whatsapp: String,
    city: String,
    state: String,
    pincode: String,
    address: String,
    requirement: String,
    requirementFiles: { type: [fileSchema], default: [] },
    expectedBusiness: String,
    clientRatingInBusiness: { type: Number },
    remark: { type: String, default: null },
    leadStatus: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "IN PROGRESS",
        "FOLLOW UP",
        "INTERESTED",
        "NOT INTERESTED",
      ],
      default: "PENDING",
    },
    followUps: {
      type: [followUpSchema],
      default: [],
    },

    statusTimeline: [timelineSchema],
    assignTo: [assignSchema],
    isAssign: { type: Boolean, default: false },
    assignBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

leadSchema.plugin(AutoIncrement, {
  id: "lead_seq_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

leadSchema.post("save", async function (doc, next) {
  try {
    if (!doc.leadId) {
      const year = new Date().getFullYear().toString().substring(2);
      const padded = String(doc.sequence_value).padStart(3, "0");
      const generatedId = `LD${year}${padded}`;
      await doc.constructor.findByIdAndUpdate(doc._id, {
        leadId: generatedId,
      });
      doc.leadId = generatedId;
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
