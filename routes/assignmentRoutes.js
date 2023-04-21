const express = require("express")
const router = express.Router()
const {createAssignment, submitAssignment, getAllAsignment, getAssignment} = require("../controllers/assignmentController")
const {isTokenValid} = require("../utils")

router.post("/submit", isTokenValid, submitAssignment)
router.get("/", isTokenValid, getAllAsignment)

module.exports = router 