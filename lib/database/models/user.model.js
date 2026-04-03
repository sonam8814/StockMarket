import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  image: { type: String },
  country: { type: String },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
  },
  investmentGoal: {
    type: String,
    enum: ['growth', 'income', 'speculation', 'preservation'],
  },
  riskTolerance: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  notificationsEnabled: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = models?.User || model('User', UserSchema);

export default User;