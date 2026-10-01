import Joi from 'joi';
import Evaluation from '../models/Evaluation.js';

const createEvaluationSchema = Joi.object({
  seminarCode: Joi.string().required(),
  score: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().optional(),
  evaluatedBy: Joi.string().hex().length(24).optional(),
});

export const createEvaluation = async (req, res, next) => {
  try {
    const { value, error } = createEvaluationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const evaluation = await Evaluation.create(value);
    res.status(201).json({ evaluation });
  } catch (err) {
    next(err);
  }
};

export const getAllEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find().lean();
    res.status(200).json({ evaluations });
  } catch (err) {
    next(err);
  }
};

export const getEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
};

export const getEvaluationSummary = async (req, res, next) => {
  try {
    const { seminarCode } = req.query;
    if (!seminarCode) {
      return res.status(400).json({ message: 'seminarCode is required' });
    }

    const results = await Evaluation.aggregate([
      { $match: { seminarCode } },
      {
        $group: {
          _id: '$seminarCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);

    if (results.length === 0) {
      return res.status(200).json({
        seminarCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    const summary = results[0];
    res.status(200).json({
      seminarCode: summary._id,
      averageScore: summary.averageScore,
      evaluationCount: summary.evaluationCount,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
};
