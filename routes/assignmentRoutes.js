const express = require("express")
const router = express.Router()
const {createAssignment, submitAssignment, getAllAssignment, getAssignment, scoreAssignment} = require("../controllers/assignmentController")
const { isTokenValid } = require("../utils")
const uploadMiddleware = require("../utils/multer")

router.post("/submit/:id", isTokenValid, uploadMiddleware, submitAssignment)
router.get("/allAssignment", isTokenValid, getAllAssignment)
router.post("/create/:moduleId", isTokenValid, createAssignment)
router.get("/getAssignment/:id", isTokenValid, getAssignment)
router.get("/scoreAssignment/:id", isTokenValid, scoreAssignment)

module.exports = router 