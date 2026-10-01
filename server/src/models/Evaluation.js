import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    seminarCode: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One evaluation per user per seminar. Anonymous evaluations (no evaluatedBy)
// are excluded so they don't all collide on a shared null value.
evaluationSchema.index(
  { seminarCode: 1, evaluatedBy: 1 },
  { unique: true, partialFilterExpression: { evaluatedBy: { $type: 'objectId' } } }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
