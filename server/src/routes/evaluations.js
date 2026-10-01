import express from 'express';
import evaluationController from '../controllers/evaluationController.js';

const router = express.Router();

// Summary route must come before :id route
router.get('/summary', evaluationController.getEvaluationSummary);

router.post('/', evaluationController.createEvaluation);
router.get('/', evaluationController.getAllEvaluations);
router.get('/:id', evaluationController.getEvaluation);

export default router;
