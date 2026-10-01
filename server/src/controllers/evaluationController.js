import { Evaluation } from '../models/Evaluation.js';

export async function createEvaluation(req, res, next) {
  try {
    const evaluation = new Evaluation(req.body);
    await evaluation.save();
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
  } catch (err) { next(err); }
}

export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.status(200).json({ evaluation });
  } catch (err) { next(err); }
}

export async function getEvaluationsSummary(req, res, next) {
  try {
    const { seminarCode } = req.query;
    
    // Validate the presence of the seminarCode query parameter
    if (!seminarCode) {
      return res.status(400).json({ message: 'seminarCode is required' });
    }

    // Compute the summary using Evaluation.aggregate()[cite: 23]
    const result = await Evaluation.aggregate([
      { $match: { seminarCode: seminarCode } },
      { $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
      }}
    ]);

    // Return 0s if no matches are found[cite: 23]
    if (result.length === 0) {
      return res.status(200).json({
        seminarCode: seminarCode,
        averageScore: 0,
        evaluationCount: 0
      });
    }

    res.status(200).json({
      seminarCode: seminarCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount
    });
  } catch (err) { next(err); }
}