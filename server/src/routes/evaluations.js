import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// Summary route must come BEFORE /:id to avoid conflict
router.get('/summary', getEvaluationSummary);

router.route('/')
  .get(getAllEvaluations)
  .post(createEvaluation);

router.get('/:id', getEvaluation);

export default router;
