import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
  createEvaluation
} from '../controllers/evaluationController.js';

const router = Router();

router.get('/', getAllEvaluations);
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);
router.post('/', createEvaluation);

export default router;
