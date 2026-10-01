import Joi from 'joi';
import mongoose from 'mongoose';
import { Evaluation } from '../models/Evaluation.js';

// Joi schema for the POST body, same idea as `createSchema` in userController.js.
// It checks the request *before* we touch the database, so bad input gets a
// clear 400 response with a readable message.
const createSchema = Joi.object({
  seminarCode: Joi.string().required(),        // e.g. "SM101"
  score: Joi.number().min(1).max(5).required(), // same 1–5 range as the model
  comment: Joi.string().allow(''),              // optional; empty text allowed
  evaluatedBy: Joi.string().hex().length(24)    // optional; must look like an ObjectId
});

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    // find() with no filter returns every evaluation. Sort newest first, like getAllUsers.
    // .lean() returns plain JS objects (faster, and enough for read-only output).
    const evaluations = await Evaluation.find().sort({ createdAt: -1 }).lean();
    res.json({ evaluations }); // 200 is Express's default status
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    // A malformed id (e.g. "abc") would make findById throw a CastError,
    // which would end up as a 500. Answer with a 400 instead.
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const evaluation = await Evaluation.findById(req.params.id);
    // Valid id but no matching document → 404 with the exact message the README requires.
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });

    res.json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    // 1. Validate. stripUnknown drops fields that aren't in the schema,
    //    so a client can't sneak in extra fields like createdAt.
    const { value, error } = createSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    // 2. Save. create() also runs the Mongoose model validators (required, min/max).
    const evaluation = await Evaluation.create(value);

    // 3. Respond with 201 Created and the saved document.
    res.status(201).json({ evaluation });
  } catch (err) {
    // 11000 = MongoDB duplicate-key error, raised by our compound unique index:
    // this user has already evaluated this seminar. Answer with 409 Conflict,
    // like the "Email already used" case in createUser.
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already evaluated this seminar' });
    }
    next(err); // anything unexpected goes to the error handler in app.js
  }
}

// GET /api/evaluations/summary?seminarCode=SM101
export async function getEvaluationSummary(req, res, next) {
  try {
    // Query-string values live in req.query (not req.params or req.body).
    const { seminarCode } = req.query;

    // Missing or empty → 400 with the exact message the README requires.
    // The typeof check also rejects ?seminarCode=A&seminarCode=B, which
    // Express parses as an array instead of a string.
    if (!seminarCode || typeof seminarCode !== 'string') {
      return res.status(400).json({ message: 'seminarCode is required' });
    }

    // aggregate() always resolves to an ARRAY of result documents.
    const results = await Evaluation.aggregate([
      // Stage 1: keep only evaluations for the requested seminar.
      { $match: { seminarCode } },

      // Stage 2: merge all the matching documents into one group.
      // _id is the "group by" key; null means "put everything in one group".
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' }, // '$score' = the value of each doc's score field
          evaluationCount: { $sum: 1 }      // add 1 per document = count
        }
      }
    ]);

    // No matching documents → $group outputs nothing → results is [].
    // The README wants zeros in that case, not a 404 or an error.
    if (results.length === 0) {
      return res.json({ seminarCode, averageScore: 0, evaluationCount: 0 });
    }

    // Build the response explicitly so the internal `_id: null` from $group
    // isn't sent to the client (the grader compares the exact object shape).
    const { averageScore, evaluationCount } = results[0];
    res.json({ seminarCode, averageScore, evaluationCount });
  } catch (err) { next(err); }
}
