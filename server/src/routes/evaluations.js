const express = require('express');
const router = express.Router();
const {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
} = require('../controllers/evaluationController');

router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);

module.exports = router;
