import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const employeeProfileSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    workEmail: { type: String, lowercase: true, trim: true, default: null },
    phone: { type: String, required: true, trim: true },
    alternateNo: { type: String, default: null },
    whatsapp: { type: String, default: null },
    dob: { type: Date, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    qualification: { type: String, default: null },
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"], default: "Single" },
    bloodGroup: { type: String, default: null },
    currentAddress: { type: String, default: null },
    permanentAddress: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    emergencyContact: {
      name: { type: String, default: null },
      relation: { type: String, default: null },
      phone: { type: String, default: null },
    },
    photo: {
      url: { type: String, default: null },
      public_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    documents: [
      {
        type: { type: String, trim: true },
        url: { type: String, default: null },
        public_url: { type: String, default: null },
        public_id: { type: String, default: null },
      },
    ],
    joiningDate: { type: Date, required: true },
    employeeType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Intern"], default: "Full-time" },
    trainingPeriod: { type: String, default: null },
    probationPeriod: { type: String, default: null },
    workLocation: { type: String, enum: ["Onsite", "Remote", "Hybrid"], default: "Onsite" },
    salary: {
      ctc: { type: Number, default: 0 },
      basic: { type: Number, default: 0 },
      hra: { type: Number, default: 0 },
      allowances: { type: Number, default: 0 },
      deductions: { type: Number, default: 0 },
    },
    bankDetail: {
      bankName: { type: String, default: null },
      accountHolderName: { type: String, default: null },
      accountNumber: { type: Number, default: null },
      ifscCode: { type: String, default: null },
      branchName: { type: String, default: null },
    },
    pfAccountNo: { type: String, default: null },
    uan: { type: String, default: null },
    esicNo: { type: String, default: null },
    status: {
      type: String,
      enum: ["Onboarding", "Active", "Inactive", "Resigned", "Terminated"],
      default: "Onboarding",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      index: true,
      default: null,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true,
      default: null,
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      index: true,
      default: null,
    },
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      index: true,
      default: null,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      index: true,
      default: null,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      index: true,
      default: null,
    },
  },
  { timestamps: true }
);

employeeProfileSchema.plugin(AutoIncrement, {
  id: "employee_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

employeeProfileSchema.post("save", async function (doc, next) {
  if (!doc.employeeId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.employeeId = `EMP${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, { employeeId: doc.employeeId });
  }
  next();
});

const EmployeeProfile = mongoose.model("EmployeeProfile", employeeProfileSchema);

export default EmployeeProfile;
