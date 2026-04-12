import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortCode:   { type: String, required: true, unique: true, index: true },
    clicks:      { type: Number, default: 0 },
    expiresAt:   { type: Date, default: null },
  },
  { timestamps: true }
);

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model('Url', urlSchema);