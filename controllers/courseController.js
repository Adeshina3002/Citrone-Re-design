const Course = require("../models/courseModel");
const User = require("../models/usersModel");
const { StatusCodes } = require("http-status-codes");

// Getting student registered courses
// const getStudentCourses = async (req, res, next) => {
//   try {
//     const user = req.user;
//     const signedInUser = await User.findById(user.userId);
//     const courses = await Course.find({ track: signedInUser.track });
//     if (!courses || courses.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "No course available or You need to update track in profile settings!" });
//     }
//     console.log(user);
//     res.status(StatusCodes.OK).json({ courses: courses });
//   } catch (err) {
//     next(err.message);
//   }
// };

// Getting student registered courses and associated modules
const getStudentCourses = async (req, res, next) => {
  try {
    const user = req.user;
    const signedInUser = await User.findById(user.userId);
    const courses = await Course.find({ track: signedInUser.track }).populate("modules")

    if (!courses || courses.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No course available or You need to update track in profile settings!" });
    }

    // const modules = [];
    // courses.forEach(course => {
    //   modules.push(...course.modules);
    // });

    res.status(StatusCodes.OK).json({ courses });

  } catch (err) {
    next(err.message);
  }
};



// Get a single course
const getCourse = async (req, res) => {
  try {
    const user = req.user;
    const course = await Course.findById({_id: req.params.courseId});
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

    // await course.populate("studentsEnrolled", { fullName: 1, _id: 1, email: 1 });
    await course.populate('modules');

    res.status(StatusCodes.OK).json({ course });

  } catch (err) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: err.message, stack: err.stack });
  }
};

// creating a course
// const createCourse = async (req, res) => {
//   try {
//     // create a course based on the track

//     const { track, modules, level, studentsEnrolled } = req.body;

//     // validate the input field
//     if (!track || !level) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "All fields are mandatory!" });
//     }

//     // find all the users with the same track
//     // Note that the track field is used to filter the enrolled students.
//     const enrolledStudents = await User.find({ track });
//     // extract the _id field from each of the user documents
//     const studentIds = enrolledStudents.map((student) => student._id);

//     // check if a course (i.e a track) exists with a particular level, do not create the same course twice
//     const course = await Course.findOne({track})

//     // if (course.level === level) {
//     //    return res.status(StatusCodes.BAD_REQUEST).json("course track with this level already exist")   
//     // }

//     const createdCourse = await Course.create({
//       track,
//       modules,
//       level,
//       studentsEnrolled: studentIds,
//     });

//     // await course.studentsEnrolled.addToSet(studentIds)
//     // course.save()

//     res.status(StatusCodes.CREATED).json({ course: createdCourse });
//   } catch (err) {
//     res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
//   }
// };

const createCourse = async (req, res) => {
  try {
    // Verify that the user creating the course is a tutor
    const user = req.user;
    console.log(user);
    // if (user.roles !== 'Tutor') {
    //   return res
    //     .status(StatusCodes.UNAUTHORIZED)
    //     .json({ message: "Unauthorized!..." });
    // }

    // Create a course based on the track
    const { track, modules, level, studentsEnrolled } = req.body;

    // Validate the input fields
    if (!track || !level) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are mandatory!" });
    }

    // Check if a course (i.e a track) exists with a particular level, do not create the same course twice
    const course = await Course.findOne({ track, level });
    if (course) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "A course with this track and level already exists!" });
    }

    // Create a new course
    const newCourse = new Course({
      track,
      modules,
      level,
      studentsEnrolled,
    });
    await newCourse.save();

    res.status(StatusCodes.CREATED).json({ message: "Course created successfully!" , newCourse});

  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while creating the course!" });
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
// Update a course
const updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Course not found!" });
    }

    // Only allow the tutor who created the course to update it
    if (course.tutor.toString() !== req.user.userId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "You are not authorized to perform this action!" });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ["track", "modules", "level", "studentsEnrolled"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid update operation!" });
    }

    updates.forEach((update) => (course[update] = req.body[update]));

    await course.save();

    res.status(StatusCodes.OK).json({ course });
  } catch (err) {
    next(err.message);
  }
};

module.exports = {
  getStudentCourses,
  getCourse,
  createCourse,
  updateCourse,
};