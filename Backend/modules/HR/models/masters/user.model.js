import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AutoIncrementFactory from "mongoose-sequence";
const AutoIncrement = AutoIncrementFactory(mongoose);

export const PROFILE_MAP = {
  EMPLOYEE: { model: "EmployeeProfile" },
  VENDOR: { model: "VendorProfile" },
  FREELANCER: { model: "FreelancerProfile" },
  CONTRACTOR: { model: "ContractorProfile" },
  PARTNER: { model: "PartnerProfile" },
  FRANCHISE: { model: "FranchiseProfile" },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: { type: String, required: true },
    whatsapp: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    altPhone: { type: String, default: null },

    password: { type: String, required: true },
    verificationCode: { type: String, default: null },
    isVerified: { type: Boolean, default: false },

    userId: { type: String, trim: true, index: true, default: null },
    type: {
      type: String,
      trim: true,
      index: true,
      default: null,
      enum: [
        "CONTRACTOR",
        "FREELANCER",
        "PARTNER",
        "EMPLOYEE",
        "VENDOR",
        "FRANCHISE",
      ],
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      index: true,
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true,
      default: null,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      index: true,
      default: null,
    },
    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      index: true,
      default: null,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      index: true,
      default: null,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      index: true,
      default: null,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      default: null,
    },
    profileModel: {
      type: String,
      enum: [
        "EmployeeProfile",
        "VendorProfile",
        "FreelancerProfile",
        "PartnerProfile",
        "FranchiseProfile",
        "ContractorProfile",
      ],
      default: null,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "profileModel",
      default: null,
    },
    manageBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    actionGroups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ActionGroup",
      default: [],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Deleted"],
      default: "Active",
    },

    lastLogin: { type: Date, default: null },
    isLogin: { type: Boolean, default: false },
    loginHistory: [
      {
        ip: String,
        device: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],

    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },

    refreshTokens: [
      { token: String, createdAt: { type: Date, default: Date.now } },
    ],
    email_verified: { type: Boolean, default: true },
    phone_verified: { type: Boolean, default: true },
    whatsappConsent: { type: Boolean, default: true },
    fcmToken: { type: String, default: null },
    webPushSubscription: { type: mongoose.Schema.Types.Mixed, default: null },
    preferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: true },
    },
    deletedAt: { type: Date, default: null },
    meta: { type: Map, of: String },
  },
  { timestamps: true },
);

userSchema.plugin(AutoIncrement, {
  id: "user_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});
// Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Map type to code
const typeCodeMap = {
  EMPLOYEE: "EMP",
  PARTNER: "PAR",
  VENDOR: "VEN",
  CONTRACTOR: "CON",
  FREELANCER: "FRE",
};

userSchema.post("save", async function (doc, next) {
  try {
    if (!doc.isNew && !doc.userId) {
      const year = new Date().getFullYear().toString().slice(2);
      const padded = String(doc.sequence_value).padStart(3, "0");

      const typeCode = typeCodeMap[doc.type] || "GEN";

      const generatedUserId = `${typeCode}${year}${padded}`;

      await doc.constructor.findByIdAndUpdate(doc._id, {
        userId: generatedUserId,
      });

      doc.userId = generatedUserId;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Password Check
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Token Generation
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

//permisions
userSchema.statics.getPermissions = async function (userId) {
  const user = await this.findById(userId)
    .populate("actionGroups")
    .populate("designation");
  if (!user) throw new Error("User not found");
  let crud = new Set();
  let workflow = new Set();
  let data = new Set();
  let system = new Set();
  if (user?.designation && user?.designation?.permissions) {
    (user.designation.permissions.crud || []).forEach((p) => crud.add(p));
    (user.designation.permissions.workflow || []).forEach((p) =>
      workflow.add(p),
    );
    (user.designation.permissions.data || []).forEach((p) => data.add(p));
    (user.designation.permissions.system || []).forEach((p) => system.add(p));
  }
  if (user?.actionGroups && user?.actionGroups.length) {
    user.actionGroups.forEach((group) => {
      (group.permissions.crud || []).forEach((p) => crud.add(p));
      (group.permissions.workflow || []).forEach((p) => workflow.add(p));
      (group.permissions.data || []).forEach((p) => data.add(p));
      (group.permissions.system || []).forEach((p) => system.add(p));
    });
  }

  return {
    crud: Array.from(crud),
    workflow: Array.from(workflow),
    data: Array.from(data),
    system: Array.from(system),
  };
};

const User = mongoose.model("User", userSchema);
export default User;
