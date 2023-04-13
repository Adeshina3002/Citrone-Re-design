const express = require('express');
const { getAllCourses, createCourse, getCourseById, updateCourse, deleteCourse  } = require('../controllers/courses')
const router = express.Router();

//ENDPOINT FOR GETTING ALL COURSES;
router.get('/',  getAllCourses);

//ENDPOINT FOR CREATING A COURSE;
router.post('/', createCourse)

//ENDPOINT FOR GETTING A COURSE B ID
router.get('/:id', getCourseById)

//ENDPOINT TO UPDATING A COURSE
router.put('/:id', updateCourse)

//ENDPOINT FOR DELETING A COURSE
router.delete('/:id', deleteCourse)

module.exports = router; 