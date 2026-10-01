const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

// Summary endpoint (MUST be before /:id)
router.get('/summary', evaluationController.getEvaluationSummary);

// General routes
router.route('/')
  .get(evaluationController.getAllEvaluations)
  .post(evaluationController.createEvaluation);

router.route('/:id')
  .get(evaluationController.getEvaluation);

module.exports = router;
