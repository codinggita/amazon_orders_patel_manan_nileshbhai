import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    entityType: {
      type: String,
      enum: ['order', 'user', 'shipping', 'payment', 'system'],
      default: 'order',
    },
    entityId: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    performedBy: {
      type: String,
      trim: true,
      default: 'system',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
