const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    compatibilityScore: { type: Number, min: 0, max: 100 },
    breakdown: {
      fitnessGoal: { type: Number, default: 0 },
      workoutTime: { type: Number, default: 0 },
      experienceLevel: { type: Number, default: 0 },
      city: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

matchSchema.index({ users: 1 });

module.exports = mongoose.model('Match', matchSchema);
