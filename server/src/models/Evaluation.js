import mongoose from 'mongoose';

const EvaluationSchema = new mongoose.Schema({
  seminarCode: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Compound unique index to prevent a user from evaluating the same seminar twice
EvaluationSchema.index({ seminarCode: 1, evaluatedBy: 1 }, { unique: true });

export const Evaluation = mongoose.model('Evaluation', EvaluationSchema);
