import { Schema, model } from "mongoose";
const leaveSchema = new Schema(
   {
      employeeId: {
         type: Schema.Types.ObjectId,
         ref: "EmployeeProfile",
         default: null
      },
      leaveType: {
         type: String,
         enum: ['Casual', 'Casual Leave', 'Sick Leave', 'Sick', 'Earned Leave','Earned', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'],
         require: true
      },
      startDate: {
         type: Date,
         require: true
      },
      endDate: {
         type: Date,
         require: true
      },
      reason: {
         type: String,
         require: true,
         trim: true
      },
      status: {
         type: String,
         enum: ['Pending', 'Approved', 'Rejected'],
         default: 'Pending'
      },
      description: {
         type: String
      },
      reviewedBy: {
         type: Schema.Types.ObjectId,
         ref: "Admin"
      },
      appliedAt: {
         type: Date,
         default: Date.now
      },
      breakDown: {
         type: [String],
         default: []
      },
      teast1: {
         type: String
      },
      department: {
         type: Schema.Types.ObjectId,
         ref: "Department",
      },
      designation: {
         type: Schema.Types.ObjectId,
         ref: "Designation",
      },
   },
   {
      timestamps: true
   }
)


const leaveModel = model("Leave", leaveSchema);

export default leaveModel;