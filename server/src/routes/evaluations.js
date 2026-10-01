import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
// Register the fixed path before /:id so "summary" is not treated as an ID.
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);

export default router;
