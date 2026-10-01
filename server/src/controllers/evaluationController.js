import { Evaluation } from '../models/Evaluation.js';

export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().sort({ createdAt: -1 });
    res.json({ evaluations });
  } catch (err) { next(err); }
}

export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ evaluation });
  } catch (err) { next(err); }
}

export async function createEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

export async function getEvaluationSummary(req, res, next) {
  try {
    const { seminarCode } = req.query;
    if (!seminarCode) return res.status(400).json({ message: 'seminarCode is required' });

    const [result] = await Evaluation.aggregate([
      { $match: { seminarCode } },
      { $group: { _id: null, averageScore: { $avg: '$score' }, evaluationCount: { $sum: 1 } } },
    ]);

    res.json({
      seminarCode,
      averageScore: result ? result.averageScore : 0,
      evaluationCount: result ? result.evaluationCount : 0,
    });
  } catch (err) { next(err); }
}
