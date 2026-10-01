import { Router } from "express";

import {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
} from "../controllers/evaluationController.js";

const router = Router();

router.get("/summary", getEvaluationSummary);
router.get("/:id", getEvaluation);
router.get("/", getAllEvaluations);
router.post("/", createEvaluation);

export default router;
