import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// Routes
router.get('/', getAllEvaluations);
router.post('/', createEvaluation);

// Summary must come before :id to avoid being treated as a parameter
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);

export default router;
