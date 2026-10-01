import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// These paths are relative to the '/api/evaluations' mount point set in app.js.
router.get('/', getAllEvaluations);   // GET  /api/evaluations
router.post('/', createEvaluation);   // POST /api/evaluations

// MUST come before '/:id'. Express checks routes top to bottom and uses the
// first match. ':id' matches ANY single path segment, including the word
// "summary", so if '/:id' came first, /summary would run getEvaluation with
// id = "summary" and never reach this handler.
router.get('/summary', getEvaluationSummary); // GET /api/evaluations/summary?seminarCode=...

router.get('/:id', getEvaluation);    // GET  /api/evaluations/:id

export default router;
