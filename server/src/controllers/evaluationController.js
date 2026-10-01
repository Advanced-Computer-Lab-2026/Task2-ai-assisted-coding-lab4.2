import Joi from 'joi';
import mongoose from 'mongoose';
import { Evaluation } from '../models/Evaluation.js';

const evaluationSchema = Joi.object({
  seminarCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional().allow('', null),
  evaluatedBy: Joi.string().hex().length(24).optional().allow(null),
});

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const { id } = req.params;

    // Handle invalid ObjectId strings gracefully with a 404
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    const evaluation = await Evaluation.findById(id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const { value, error } = evaluationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const evaluation = await Evaluation.create(value);
    res.status(201).json({ evaluation });
  } catch (err) {
    // Handle duplicate key error for compound unique index
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Evaluation already exists for this seminar' });
    }
    next(err);
  }
}

// GET /api/evaluations/summary?seminarCode=SM101
export async function getEvaluationSummary(req, res, next) {
  try {
    const { seminarCode } = req.query;

    if (!seminarCode) {
      return res.status(400).json({ message: 'seminarCode is required' });
    }

    const result = await Evaluation.aggregate([
      { $match: { seminarCode } },
      {
        $group: {
          _id: '$seminarCode',
          averageScore: { \(avg: '\)score' },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(200).json({
        seminarCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    res.status(200).json({
      seminarCode: result[0]._id,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount,
    });
  } catch (err) {
    next(err);
  }
}