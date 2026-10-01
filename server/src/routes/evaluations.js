import express from 'express';
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = express.Router();

// GET /api/evaluations/summary
router.get('/summary', getEvaluationSummary);

// GET /api/evaluations
router.get('/', getAllEvaluations);

// GET /api/evaluations/:id
router.get('/:id', getEvaluation);

// POST /api/evaluations
router.post('/', createEvaluation);

export default router;
