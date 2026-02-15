import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const clientSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      unique: true,
      index: true,
    },

    leadId: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lead",
        },
      ],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one lead ID is required",
      },
    },

    projectId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      trim: true,
      match: /^[0-9]{10}$/,
      required: true,
    },

    whatsapp: {
      type: String,
      trim: true,
      match: /^[0-9]{10}$/,
      default: null,
    },

    altPhone: {
      type: String,
      trim: true,
      match: /^[0-9]{10}$/,
      default: null,
    },

    companyName: {
      type: String,
      trim: true,
      default: null,
    },

    businessType: {
      type: String,
      trim: true,
      default: null,
    },

    designation: {
      type: String,
      trim: true,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      default: null,
    },

    state: {
      type: String,
      trim: true,
      default: null,
    },

    pincode: {
      type: String,
      match: /^[0-9]{6}$/,
      default: null,
    },
    revenue: { type: String, default: "LOW", enum: ["LOW", "HIGH"] },
    satisfaction: { type: String, default: "LOW", enum: ["LOW", "HIGH"] },
    repeatPotential: { type: String, default: "LOW", enum: ["LOW", "HIGH"] },
    complexity: { type: String, default: "LOW", enum: ["LOW", "HIGH"] },
    engagement: { type: String, default: "LOW", enum: ["LOW", "HIGH"] },
    positiveAttitude: { type: String, default: "LOW", enum: ["LOW", "HIGH"] },

    clientRating: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isSentToManager:{type:Boolean,default:false},
    isSentToProjectDepartment:{type:Boolean,default:false},
    isSentToRecceDepartment:{type:Boolean,default:false},
    },
  { timestamps: true }
);

clientSchema.plugin(AutoIncrement, {
  id: "client_seq_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

// Id 
clientSchema.post("save", async function (doc, next) {
  try {
    if (!doc.clientId) {
      const year = new Date().getFullYear().toString().substring(2);
      const padded = String(doc.sequence_value).padStart(3, "0");
      const generatedId = `DSS${year}${padded}`;
      await doc.constructor.findByIdAndUpdate(doc._id, {
        clientId: generatedId,
      });
      doc.clientId = generatedId;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// password 
// clientSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// clientSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

const Client = mongoose.model("Client", clientSchema);
export default Client;
