import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// The summary route must come BEFORE the :id route
router.get('/summary', getEvaluationSummary);

router.get('/', getAllEvaluations);
router.get('/:id', getEvaluation);
router.post('/', createEvaluation);

export default router;
