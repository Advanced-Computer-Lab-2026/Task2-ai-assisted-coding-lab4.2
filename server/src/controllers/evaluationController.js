import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().populate('evaluatedBy', 'username');
    res.status(200).json({ evaluations });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id).populate('evaluatedBy', 'username');
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.status(200).json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const { seminarCode, score, comment, evaluatedBy } = req.body;
    const evaluation = await Evaluation.create({
      seminarCode,
      score,
      comment,
      evaluatedBy,
    });
    res.status(201).json({ evaluation });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User has already evaluated this seminar' });
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

    const summary = await Evaluation.aggregate([
      { $match: { seminarCode: seminarCode } },
      {
        $group: {
          _id: '$seminarCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        seminarCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    const result = {
      seminarCode: summary[0]._id,
      averageScore: summary[0].averageScore,
      evaluationCount: summary[0].evaluationCount,
    };

    res.status(200).json(result);
  } catch (err) { next(err); }
}
