import mongoose from 'mongoose';

// Schema for a single seminar evaluation (README section 1).
// Same structure as User.js: field definitions first, then options.
const evaluationSchema = new mongoose.Schema(
  {
    // Which seminar is being evaluated, e.g. "SM101". Mandatory.
    seminarCode: { type: String, required: true },

    // Rating from 1 to 5. Mongoose rejects a missing value or anything
    // outside the range with a ValidationError before it reaches the DB.
    score: { type: Number, required: true, min: 1, max: 5 },

    // Free-text feedback. Optional, so no `required`.
    comment: { type: String },

    // The user who wrote the evaluation. It stores the user's _id, and
    // `ref: 'User'` points at the model registered in User.js
    // (mongoose.model('User', ...)), so .populate('evaluatedBy') can
    // replace the id with the full user document. Optional.
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  // Adds createdAt and updatedAt fields automatically (same as User.js).
  { timestamps: true }
);

// Compound unique index: the *pair* (seminarCode, evaluatedBy) must be unique.
// So one user can evaluate a given seminar only once, but can still
// evaluate other seminars, and other users can evaluate the same seminar.
// The 1 means ascending order for each field in the index.
// A duplicate insert fails with MongoDB error code 11000.
evaluationSchema.index({ seminarCode: 1, evaluatedBy: 1 }, { unique: true });

// Same named-export style as User.js: `export const User = ...`
export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
