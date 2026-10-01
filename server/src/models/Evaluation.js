const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  seminarCode: {
    type: String,
    required: [true, 'Seminar code is required'],
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [1, 'Score must be at least 1'],
    max: [5, 'Score cannot be more than 5'],
  },
  comment: {
    type: String,
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true
});

// Compound unique index: one evaluation per user per seminar
evaluationSchema.index({ seminarCode: 1, evaluatedBy: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
