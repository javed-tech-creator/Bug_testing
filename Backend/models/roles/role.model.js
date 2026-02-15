import { Schema, model } from "mongoose";

// const roleSchema = new Schema(
//   {
//     role: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     permissions: {
//       lead: {
//         create: { type: Boolean, default: false },
//         view: { type: Boolean, default: false },
//         update: { type: Boolean, default: false },
//         delete: { type: Boolean, default: false },
//         assign: { type: Boolean, default: false },
//         manage: { type: Boolean, default: false },
//       },
//       performance:{
//          view:{type:Boolean,default:false},
//          update:{type:Boolean,default:false}
//       }
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const RoleModel = model("Role", roleSchema);
// export default RoleModel;


const roleSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: {
      type: Map,
      of: new Schema({}, { strict: false, _id: false }),
      default: {},
    },
  },
  {
    timestamps: true,
  }
);


const RoleModel = model("Role", roleSchema);
export default RoleModel;