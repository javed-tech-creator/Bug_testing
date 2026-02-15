import mongoose from "mongoose";
const SlotTargetSchema = new mongoose.Schema({
  monthlyTargetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "MonthlyTarget", 
    required: true,
    index: true 
  },
  executiveId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true 
  },
  financialYear: { type: String, required: true },
  quarter: { type: String, required: true },
  month: { type: String, required: true },
  
  slot: { 
    type: String, 
    enum: ["S1", "S2", "S3"], 
    required: true 
  },
  
  slotStartDate: Date,
  slotEndDate: Date,
  meetingDate: Date,
  
  slotTarget: { type: Number, required: true },
  achievedAmount: { type: Number, default: 0 },

  leadIn: { type: Number, default: 0, max: 99999 },
  salesIn: { type: Number, default: 0, max: 9999 },
  businessIn: { type: Number, default: 0, max: 9999 },
  amountIn: { type: Number, default: 0, max: 100000000 }, 
  
  meetingNotes: { type: String, default: "" },
  carryForwardReason: { type: String, default: "" },
  
  forwardedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "SlotTarget" },
  forwardedTo: { type: mongoose.Schema.Types.ObjectId, ref: "SlotTarget" },
  forwardedAmount: { type: Number, default: 0 },
  
  submittedAt: Date,
  
  approval: {
    status: { 
      type: String, 
      enum: ["pending", "approved", "rejected", "needs_revision"], 
      default: "pending" 
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
    comments: String,
    revisionRequest: {
      requestedAt: Date,
      reason: String,
      requiredChanges: String
    }
  },
  slotNumber: { type: Number, min: 1, max: 3 }, 
  isFinalSlot: { type: Boolean, default: false }
}, {
  timestamps: true
});


SlotTargetSchema.pre('save', async function(next) {
  const MonthlyTarget = mongoose.model('MonthlyTarget');
  const monthlyTarget = await MonthlyTarget.findById(this.monthlyTargetId);
  
  if (monthlyTarget) {
    const SlotTarget = mongoose.model('SlotTarget');
    const existingSlots = await SlotTarget.find({
      monthlyTargetId: this.monthlyTargetId,
      _id: { $ne: this._id }
    });
    
    const currentTotal = existingSlots.reduce((sum, slot) => sum + slot.slotTarget, 0);
    const newTotal = currentTotal + this.slotTarget;
    
    if (newTotal > monthlyTarget.monthlyTarget) {
      return next(new Error(`Total slot targets (₹${newTotal}L) exceed monthly target (₹${monthlyTarget.monthlyTarget}L)`));
    }
    
    if (this.isModified('achievedAmount')) {
      const totalAchieved = existingSlots.reduce((sum, slot) => sum + slot.achievedAmount, 0) + this.achievedAmount;
      monthlyTarget.totalAchieved = totalAchieved;
      monthlyTarget.achievementPercentage = (totalAchieved / monthlyTarget.monthlyTarget) * 100;
      await monthlyTarget.save();
    }
  }
  next();
});

SlotTargetSchema.pre('save', function(next) {
  if (this.isNew) {
    const monthMap = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    const year = this.financialYear ? parseInt(this.financialYear.split('-')[0]) : new Date().getFullYear();
    const monthIndex = monthMap[this.month] || 0;
    
    const slotDateRanges = {
      'S1': { start: 1, end: 10 },
      'S2': { start: 11, end: 20 },
      'S3': { start: 21, end: 31 }
    };
    
    const range = slotDateRanges[this.slot];
    if (range) {
      this.slotStartDate = new Date(year, monthIndex, range.start);
      this.slotEndDate = new Date(year, monthIndex, range.end);
      this.meetingDate = new Date(year, monthIndex, range.end); 
      this.isFinalSlot = this.slot === 'S3';
    }
  }
  next();
});


const SlotTarget = mongoose.model("SlotTarget", SlotTargetSchema);
export default SlotTarget;