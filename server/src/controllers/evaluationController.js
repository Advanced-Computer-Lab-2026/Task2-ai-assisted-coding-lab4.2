import Joi from 'joi';
import { Evaluation } from '../models/Evaluation.js';

// Describes what a valid POST body must look like.
const createSchema = Joi.object({
  seminarCode: Joi.string().required(),          // must be a non-empty string
  score: Joi.number().min(1).max(5).required(),  // must be a number from 1 to 5
  comment: Joi.string().allow(''),               // optional, may be an empty string
  evaluatedBy: Joi.string().hex().length(24)     // optional, must look like a MongoDB ObjectId
});

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    // Fetch every evaluation, newest first.
    const evaluations = await Evaluation.find().sort({ createdAt: -1 });
    // res.json sends status 200 by default.
    res.json({ evaluations });
  } catch (err) { next(err); } // hand unexpected errors to the error handler in app.js
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    // req.params.id is the :id part of the URL.
    const evaluation = await Evaluation.findById(req.params.id);
    // findById returns null when no document has that id.
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    // Check the request body against the schema; value is the validated body.
    const { value, error } = createSchema.validate(req.body);
    // Invalid body: stop here and tell the client what is wrong.
    if (error) return res.status(400).json({ message: error.message });

    // Save the new evaluation in MongoDB.
    const evaluation = await Evaluation.create(value);
    // 201 = Created.
    res.status(201).json({ evaluation });
  } catch (err) {
    // 11000 is MongoDB's duplicate-key error, raised by the unique index on
    // { seminarCode, evaluatedBy } when the same user evaluates a seminar twice.
    if (err.code === 11000) return res.status(409).json({ message: 'Evaluation already submitted for this seminar' });
    next(err);
  }
}

// GET /api/evaluations/summary?seminarCode=SM101
export async function getEvaluationSummary(req, res, next) {
  try {
    // req.query holds the part of the URL after the "?".
    const { seminarCode } = req.query;
    // Reject a missing value, and anything that is not plain text
    // (e.g. ?seminarCode[$ne]=x would arrive as an object).
    if (!seminarCode || typeof seminarCode !== 'string') {
      return res.status(400).json({ message: 'seminarCode is required' });
    }

    // Let MongoDB do the maths. aggregate() returns an array, so take its first item.
    const [summary] = await Evaluation.aggregate([
      // Step 1: keep only the evaluations for this seminar.
      { $match: { seminarCode } },
      // Step 2: collapse them into one result with the average score and
      // a count ($sum: 1 adds 1 for each document).
      { $group: { _id: '$seminarCode', averageScore: { $avg: '$score' }, evaluationCount: { $sum: 1 } } }
    ]);

    // If nothing matched, the array is empty and summary is undefined,
    // so fall back to 0 for both numbers.
    res.json({
      seminarCode,
      averageScore: summary?.averageScore ?? 0,
      evaluationCount: summary?.evaluationCount ?? 0
    });
  } catch (err) { next(err); }
}
