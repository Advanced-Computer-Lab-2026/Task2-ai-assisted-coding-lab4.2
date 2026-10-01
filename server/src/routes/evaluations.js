import express from 'express';
import * as evaluationController from '../controllers/evaluationController.js';

const router = express.Router();

router.post('/', evaluationController.createEvaluation);
router.get('/', evaluationController.getAllEvaluations);
router.get('/summary', evaluationController.getEvaluationSummary);
router.get('/:id', evaluationController.getEvaluation);

export default router;
