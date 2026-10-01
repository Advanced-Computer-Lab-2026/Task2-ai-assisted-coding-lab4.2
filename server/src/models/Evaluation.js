import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  seminarCode: { 
    type: String, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String 
  },
  evaluatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
});

// Add compound unique index to prevent duplicate seminar evaluations by the same user[cite: 22]
evaluationSchema.index({ seminarCode: 1, evaluatedBy: 1 }, { unique: true });

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);