import { Schema, model, models } from 'mongoose';

const AlertSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  alertType: {
    type: String,
    required: true,
    enum: ['price_above', 'price_below', 'volume_above'],
    default: 'price_above',
  },
  targetPrice: {
    type: Number,
    required: function() {
      return this.alertType === 'price_above' || this.alertType === 'price_below';
    },
  },
  targetVolume: {
    type: Number,
    required: function() {
      return this.alertType === 'volume_above';
    },
  },
  condition: {
    type: String,
    enum: ['greater_than', 'less_than'],
    default: 'greater_than',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  triggeredAt: {
    type: Date,
    default: null,
  },
  lastCheckedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient querying of active alerts
AlertSchema.index({ userId: 1, isActive: 1 });
AlertSchema.index({ symbol: 1, isActive: 1 });

const Alert = models?.Alert || model('Alert', AlertSchema);

export default Alert;