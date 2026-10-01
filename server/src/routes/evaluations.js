import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// /summary must be defined before /:id to avoid being captured as an ID
router.get('/summary', getEvaluationSummary);

router.get('/', getAllEvaluations);
router.get('/:id', getEvaluation);
router.post('/', createEvaluation);

export default router;
