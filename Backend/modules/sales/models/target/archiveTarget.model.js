 import mongoose from "mongoose";
 
 const ArchiveTargetSchema = new mongoose.Schema({
  originalMonthlyTargetId: mongoose.Schema.Types.ObjectId,
  originalSlotTargetIds: [mongoose.Schema.Types.ObjectId],
  
  executiveId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  financialYear: String,
  quarter: String,
  month: String,
  
  monthlyTarget: Number,
  
  slotSummary: [
    {
      slot: String,
      slotTarget: Number,
      achievedAmount: Number,
      leadIn: Number,
      salesIn: Number,
      businessIn: Number,
      amountIn: Number,
      meetingNotes: String,
      carryForwardReason: String,
      approved: Boolean,
      approvalDate: Date,
      approvedBy: mongoose.Schema.Types.ObjectId
    }
  ],
  
  totals: {
    totalSlotTarget: Number,
    totalAchieved: Number,
    totalLeadIn: Number,
    totalSalesIn: Number,
    totalBusinessIn: Number,
    totalAmountIn: Number,
    achievementPercentage: Number
  },
  
  incentive: {
    eligibleAmount: Number,
    status: String,
    paidDate: Date
  },
  
  archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  archiveReason: String,
  
  archivedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});
const ArchiveTarget = mongoose.model("ArchiveTarget", ArchiveTargetSchema);
export default ArchiveTarget;