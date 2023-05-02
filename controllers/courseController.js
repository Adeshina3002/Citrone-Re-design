const Course = require("../models/courseModel");
const User = require("../models/usersModel");
const { StatusCodes } = require("http-status-codes");

// Getting student registered courses
const getStudentCourses = async (req, res, next) => {
  try {
    const user = req.user;
    const signedInUser = await User.findById(user.userId);
    const courses = await Course.find({ track: signedInUser.track });
    if (!courses || courses.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No course available or You need to update track in profile settings!" });
    }
    console.log(user);
    res.status(StatusCodes.OK).json({ courses: courses });
  } catch (err) {
    next(err.message);
  }
};

// Get a single course
const getCourse = async (req, res) => {
  try {
    const user = req.user;
    const course = await Course.findById(req.params.id);
    const student = await User.findById(user.userId);
    //const allStudents = await User.find();
    if (!course) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Course currently not available!" });
    }
    if (course.track !== student.track) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Update your track on your student profile" });
    }
    await course.populate("studentsEnrolled", { firstName: 1, _id: 0 });
    res.status(StatusCodes.OK).json({ course });
  } catch (err) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: err.message, stack: err.stack });
  }
};

// creating a course
const createCourse = async (req, res) => {
  try {
    const { track, modules, level, studentsEnrolled } = req.body;
    // validate the input field
    if (!track || !level) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are mandatory!" });
    }
    // find all the users with the same track
    // Note that the track field is used to filter the enrolled students.
    const enrolledStudents = await User.find({ track });
    // extract the _id field from each of the user documents
    const studentIds = enrolledStudents.map((student) => student._id);
    const createdCourse = await Course.create({
      track,
      modules,
      level,
      studentsEnrolled: studentIds,
    });
    res.status(StatusCodes.CREATED).json({ course: createdCourse });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }
};
// const createCourse = async (req, res) => {
//   try {
//     const { courseName, modules, level, studentsEnrolled } = req.body;
//     // validate the input field
//     if (!courseName || !level) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json("All fields are mandatory!");
//     }
//     const createdCourse = await Course.create({
//       courseName,
//       modules,
//       level,
//       studentsEnrolled,
//     });
//     res.status(StatusCodes.CREATED).json({ course: createdCourse });
//   } catch (err) {
//     res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
//   }
// };


// updating a course
const updateCourse = async (req, res) => {
  res.json({ message: "this is the update course route" });
};

module.exports = {
  getStudentCourses,
  getCourse,
  createCourse,
  updateCourse,
};