const express = require("express")
const router = express.Router()
const {createAssignment, submitAssignment, getAllAssignment, getAssignment} = require("../controllers/assignmentController")
const {isTokenValid} = require("../utils")

router.post("/submit", isTokenValid, submitAssignment)
router.get("/allAssignment", isTokenValid, getAllAssignment)
router.post("/create/:moduleId", isTokenValid, createAssignment)
router.get("/getAssignment", isTokenValid, getAssignment)

module.exports = router 