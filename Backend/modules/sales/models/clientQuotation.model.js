import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
const AutoIncrement = AutoIncrementFactory(mongoose);

const quotationSchema = new mongoose.Schema({
  quotationId: { type: String, unique: true, index: true,  },
  quotationNumber: { type: String }, 

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
    index: true,
    unique:true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
    index: true
  },

  quotationDate: { type: Date, default: Date.now },
  validUntil: { type: Date },

  client: {
    name: { type: String, required: true },
    company: { type: String, default: "" },
    contact: { type: String, required: true },
    email: { type: String, default: "" },
    address: { type: String, default: "" }
  },

  project: {
    title: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, default: "" }
  },

  products: [
    {
      name: { type: String, required: true },
      unit: { type: String, default: "pcs" },
      qty: { type: Number, required: true, min: 1 },
      basePrice: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 }
    }
  ],

  pricing: {
    totalAmount: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    gstPercent: { type: Number, default: 18 },
    gstAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true }
  },
  quotationPdf:{ url: { type: String, trim: true },
    public_url: { type: String, trim: true },
    public_id: { type: String, trim: true },},

  remark: { type: String, default: "" },
  additionalNotes: { type: String, default: "" },

  status: {
    type: String,
    enum: ["draft", "sent", "accepted", "rejected", "expired"],
    default: "draft"
  },

  termsConditions: [{ type: String }],

  sentHistory: [
    {
      sentAt: { type: Date, default: Date.now },
      sentTo: String,
      sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

quotationSchema.plugin(AutoIncrement, {
  id: "quotation_seq_counter",
  inc_field: "sequence_value",
  start_seq: 1
});


quotationSchema.post("save", async function (doc, next) {
  try {
    if (!doc.sequence_value) {
      return next(new Error("sequence_value not generated"));
    }
   if (!doc.quotationId) {
    console.log("Generating quotationId for doc:", doc);
      const year = new Date().getFullYear().toString().slice(2);
      const padded = String(doc.sequence_value).padStart(4, "0") || "0000";
      const qId = `QT${year}${padded}`;

      await doc.constructor.findByIdAndUpdate(doc._id, {
        quotationId: qId,
        quotationNumber: qId,
      });

      doc.quotationId = qId;       
      doc.quotationNumber = qId;    
    }
    console.log("Generated quotationId:", doc.quotationId);
    next();
  } catch (error) {
    next(error);
  }
});


const ClientQuotation =  mongoose.model("ClientQuotation", quotationSchema);
export default ClientQuotation
