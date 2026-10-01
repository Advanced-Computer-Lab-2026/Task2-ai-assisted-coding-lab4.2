const Evaluation = require('../models/Evaluation');

exports.createEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ evaluation });
  } catch (err) {
    next(err);
  }
};

exports.getAllEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
  } catch (err) {
    next(err);
  }
};

exports.getEvaluation = async (req, res, next) => {
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

exports.getEvaluationSummary = async (req, res, next) => {
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

    const result = summary[0];
    res.status(200).json({
      seminarCode: result._id,
      averageScore: result.averageScore,
      evaluationCount: result.evaluationCount,
    });
  } catch (err) {
    next(err);
  }
};
