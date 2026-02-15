import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const clientProductSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignageProduct",
      required: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    unitPrice: {
      type: mongoose.Decimal128,
      default: 0.0
    },
    totalPrice: {
      type: mongoose.Decimal128,
      default: 0.0
    },
    specifications: {
      type: String,
      trim: true,
      default: null
    },
    status: {
      type: String,
      enum: ["PLANNED", "IN_PRODUCTION", "COMPLETED", "INSTALLED"],
      default: "PLANNED"
    },
    notes: {
      type: String,
      trim: true,
      default: null
    },
    
    // ✅ NEW FIELDS:
    
    // 1. Product Timeline Tracking
    productionTimeline: {
      plannedStart: { type: Date, default: null },
      plannedEnd: { type: Date, default: null },
      actualStart: { type: Date, default: null },
      actualEnd: { type: Date, default: null }
    },
    
    // 2. Priority & Urgency
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM"
    },
    
    // 3. Installation Details
    installationDetails: {
      installationDate: { type: Date, default: null },
      installedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        default: null 
      },
      installationNotes: { type: String, default: null }
    },
    
    // 4. Quality Control
    qualityCheck: {
      passed: { type: Boolean, default: false },
      checkedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        default: null 
      },
      checkedAt: { type: Date, default: null },
      notes: { type: String, default: null }
    },
    
    // 5. Warranty Information
    warranty: {
      hasWarranty: { type: Boolean, default: false },
      warrantyPeriod: { type: Number, default: 0 }, // in months
      warrantyStart: { type: Date, default: null },
      warrantyNotes: { type: String, default: null }
    },
    
    // 6. Additional Metadata
    tags: [{ type: String, trim: true }],
    
    // 7. Progress Tracking
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    
    // 8. Is Deleted Flag
    isDeleted: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);


// Auto Increment Plugin for customId
clientProductSchema.plugin(AutoIncrementFactory(mongoose), {
  id: "client_product_seq",
  inc_field: "sequence_no",
  start_seq: 1,
});

clientProductSchema.pre("save", function (next) {
  if (!this.customId) {
    const projectPrefix = this.projectId ? this.projectId.toString().slice(0, 4) : "PRD";
    const paddedSeq = String(this.sequence_no).padStart(3, "0");
    this.customId = `${projectPrefix}-PROD-${paddedSeq}`;
  }
  next();
});

const ClientProduct = mongoose.model(
  "ClientProduct",
  clientProductSchema
); 

export default ClientProduct;