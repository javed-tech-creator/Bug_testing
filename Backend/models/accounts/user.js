import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);
 
userSchema.methods.matchPassword = function (password) {
  
  return password === this.password;
};

const Accountauth = mongoose.models.User || mongoose.model("QUser", userSchema);

export default Accountauth;