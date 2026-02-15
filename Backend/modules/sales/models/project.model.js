import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import ProjectEventLog from "./projectEventLogs.js";

const AutoIncrement = AutoIncrementFactory(mongoose);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "IN PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
    durationHrs: { type: Number, default: 0 },
    remark: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const departmentTimelineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "IN PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null },
    percent: { type: Number, min: 0, max: 100, default: 0 },
    remark: { type: String, trim: true, default: null },
    tasks: { type: [taskSchema], default: [] },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    public_url: { type: String, trim: true },
    public_id: { type: String, trim: true },
    type: {
      type: String,
      default: null,
    },
    // ✅ MINOR ADD: Document name for better identification
    name: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    projectId: { type: String, unique: true, index: true },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    projectName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    projectDescription: { type: String, required: true, trim: true },

    discussionDone: {
      type: String,
      required: true,
    },

    requirement: { type: String, trim: true, default: null },
    instructionRecce: { type: String, trim: true, default: null },
    instructionDesign: { type: String, trim: true, default: null },
    instructionInstallation: { type: String, trim: true, default: null },
    instructionOther: { type: String, trim: true, default: null },

    address: { type: String, trim: true, default: null },
    siteLocation: { type: String, required: true, trim: true },
    sameAsAddress: { type: Boolean, default: false },

    expectedRevenue: { type: String, default: 0 },
    remarks: { type: String, trim: true, default: null },

    documents: { type: [documentSchema], default: [] },

    totalAmount: { type: String, default: 0 },
    discountPercent: { type: String, default: 0 },
    discountAmount: { type: String, default: 0 },
    payableAmount: { type: String, default: 0 },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClientProduct",
        default: [],
      },
    ],

    reccemanagerId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      }
    ],

    timeline: { type: [departmentTimelineSchema], default: [] },

    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    relationshipManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dealBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    leadBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "On Hold", "Completed", "Cancelled"],
      default: "Active",
    },
    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    hasQuotation: { type: Boolean, default: false },
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientQuotation",
      default: null,
    },
    projectTimeline: {
      startDate: { type: Date, default: null },
      expectedEndDate: { type: Date, default: null },
      actualEndDate: { type: Date, default: null },
    },

    // Recce Review Submission Data
    reviewSubmit: {
      checks: {
        environmentalConditions: { type: Boolean, default: false },
        productRequirements: { type: Boolean, default: false },
        uploadedImages: { type: Boolean, default: false },
        uploadedVideos: { type: Boolean, default: false },
        installationDetails: { type: Boolean, default: false },
        instructionsRemarks: { type: Boolean, default: false },
        submittedSameDay: { type: Boolean, default: false },
      },
      flagRaised: { type: Boolean, default: false },
      flagColor: { type: String, trim: true, default: "" },
      flagReason: { type: String, trim: true, default: "" },
      rejectReason: { type: String, trim: true, default: "" },
      accuracyScore: { type: Number, min: 0, max: 5, default: 0 },
      comment: { type: String, trim: true, default: "" },
      reworkInstructions: { type: String, trim: true, default: "" },
      approvalStatus: {
        type: String,
        enum: ["", "Pending", "Accepted", "Rejected", "Flag Raised"],
        default: "",
      },
      submittedAt: { type: Date, default: null },
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      updatedAt: { type: Date, default: null },
    },

    recceReviewHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "New", "Accepted", "Declined", "Flag"],
          default: "Pending",
        },
        reason: { type: String, default: "" },
        flageType: {
          type: String,
          enum: ["", "High", "Medium", "Low"],
          default: "",
        },
        comment: { type: String, default: "" },
        actionDate: {
          type: Date,
          default: Date.now,
        }
      }
    ],
    isDeleted: { type: Boolean, default: false },
    isRecceCall: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.plugin(AutoIncrement, {
  id: "project_seq_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

projectSchema.post("save", async function (doc, next) {
  try {
    if (!doc.projectId) {
      const year = new Date().getFullYear().toString().substring(2);
      const padded = String(doc.sequence_value).padStart(3, "0");
      const generatedId = `PR${year}${padded}`;
      await doc.constructor.findByIdAndUpdate(doc._id, {
        projectId: generatedId,
      });
      doc.projectId = generatedId;
    }
    next();
  } catch (err) {
    next(err);
  }
});

projectSchema.post("save", async function (doc) {
  if (this.isNew) {
    await ProjectEventLog.logEvent({
      projectId: doc._id,
      eventType: "PROJECT_CREATED",
      title: "Project Created",
      createdBy: doc.dealBy || doc.leadBy || null,
      description: `Project ${doc.projectName} created`,
      metaData: { projectId: doc.projectId },
    });
  }
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
