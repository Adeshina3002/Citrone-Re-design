const express = require("express");
const {
  getStudentCourses,
  getCourse,
  createCourse,
  updateCourse,
} = require("../controllers/courseController");
const { isTokenValid } = require("../utils/jwt");

const router = express.Router();

router.get("/registeredcourse", isTokenValid, getStudentCourses);
router.get("/:courseid", isTokenValid, getCourse);
router.post("/create", isTokenValid, createCourse);
router.put("/update/:id", updateCourse);


module.exports = router;



