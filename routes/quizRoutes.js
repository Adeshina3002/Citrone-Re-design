const express = require("express")
const router = express.Router()
const { createQuiz, getQuiz, submitQuiz } = require("../controllers/quizController")
const { isTokenValid } = require("../utils/jwt")

router.post("/create/:moduleId", isTokenValid, createQuiz)
router.get("/:quizId", isTokenValid, getQuiz)
router.post("/submit/:quizId", isTokenValid, submitQuiz)

module.exports = router