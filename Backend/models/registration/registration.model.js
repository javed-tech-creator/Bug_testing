import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const salesRegSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    whatsappNo: {
      type: String,
      required: true,
      unique: true,
    },
    altNo: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    empId: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      default: null
    },
    zone: {
      type: String,
      default: null
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: [
        'SaleHOD', 'SalesTL', 'SaleEmployee', 'Vendor', 'Manager',
        'HOD', 'techEngineer', 'techManager', 'MarketingManager',
      ],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

salesRegSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

salesRegSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update?.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
});

const registrationModel = model("Registration", salesRegSchema);

export default registrationModel;
