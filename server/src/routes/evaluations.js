
const express = require("express");
const router = express.Router();

const {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
} = require("../controllers/evaluationController");

// POST /api/evaluations
router.post("/", createEvaluation);

// GET /api/evaluations
router.get("/", getAllEvaluations);

// GET /api/evaluations/:id
router.get("/:id", getEvaluation);

module.exports = router;