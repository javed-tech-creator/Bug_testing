import mongoose from 'mongoose';

const projectEventLogsSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  departmentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Department",
  },
  eventType: {
    type: String,
    enum: [
      'PROJECT_CREATED', 
      'QUOTATION_UPDATED', 
      'PAYMENT_RECEIVED', 
      'STATUS_UPDATED', 
      'PROJECT_UPDATED',
      'TEAM_ASSIGNED',
      "OTHER"
    ],
    default: "OTHER"
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000
  },
metaData: {
  type: mongoose.Schema.Types.Mixed,
  default: () => ({})
},

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });


projectEventLogsSchema.index({ projectId: 1, createdAt: -1 });
projectEventLogsSchema.index({ eventType: 1 });
projectEventLogsSchema.index({ createdBy: 1 });
projectEventLogsSchema.index({ createdAt: -1 });


projectEventLogsSchema.statics.logEvent = async function(eventData) {
  const event = new this(eventData);
  return await event.save();
};

const ProjectEventLog = mongoose.model('ProjectEventLog', projectEventLogsSchema);
export default ProjectEventLog;