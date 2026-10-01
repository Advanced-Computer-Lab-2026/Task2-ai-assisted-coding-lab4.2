import express from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = express.Router();

router.get('/summary', getEvaluationSummary);
router.get('/', getAllEvaluations);
router.post('/', createEvaluation);
router.get('/:id', getEvaluation);

export default router;
