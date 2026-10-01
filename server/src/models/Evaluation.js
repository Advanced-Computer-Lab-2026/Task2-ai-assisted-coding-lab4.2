const mongoose = require('mongoose');

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
    required: false,
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
}, {
  timestamps: true
});

// Compound unique index to ensure a user can only evaluate a specific seminar once
EvaluationSchema.index({ seminarCode: 1, evaluatedBy: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', EvaluationSchema);
