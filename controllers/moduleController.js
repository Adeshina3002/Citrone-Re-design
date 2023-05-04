const Module = require("../models/moduleModels");
const Course = require("../models/courseModel");
const { StatusCodes } = require("http-status-codes");


// Getting all modules
const getAllModules = async (req, res, next) => {
  try {
    // Get the user's track from the request object
    const track = req.user.track;
    if (!track) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User's track not found!" });
    }
    
    // Find all modules with the given track
    const modules = await Module.find({ "courseModule.track": track });
    if (modules.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No modules found for the user's track!" });
    }

    res.status(StatusCodes.OK).json({ message: modules });

  } catch (err) {
    next(err.message);
  }
};



// Get a module
const getModule = async (req, res, next) => {
  try {
    const moduleId = req.params.id;
    const modules = await Module.find();
    const module = modules.find((module) => module.id === moduleId);
    if (!module) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Module with id ${moduleId} not found!` });
    }
    res.status(StatusCodes.OK).json({ message: module });
  } catch (err) {
    next(err.message);
  }
};


// Creating a module
// const createModule = async (req, res, next) => {
//   try {
//     // validating the course exist in the db
//     const course = await Course.findById(req.params.courseId);

//     if (!course) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "Course does not exist!" });
//     }

//     // ensuring that all necessary properties are sent from the client
//     const { name, title, modulePicture, lessons, liveClassURL, recordedClassURL } = req.body;

//     // validating the all the properties from the client
//     if (!name || !title || !lessons || !liveClassURL) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "All fields mandatory!" });
//     }

//     // checking if the module exist
//     const moduleExist = await Module.findOne({
//       "courseModule.title": title,
//       "course": course._id,
//     });

//     if (moduleExist) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "Module already created!" });
//     }

//     // creating the module to the db
//     const createdModule = await Module.create({
//       courseModule: { name, title, modulePicture },
//       lessons: [{
//         name: lessons[0].lessonName,
//         title: lessons[0].lessonTitle,
//         description: lessons[0].description,
//         fileURL: lessons[0].fileURL,
//       }],
//       liveClassURL,
//       recordedClassURL,
//       course: course._id,
//     });

//     // adding moduleId to the module schema
//     course.modules.addToSet(createdModule._id);
//     await course.save();

//     res.status(StatusCodes.CREATED).json({ module: createdModule });
//   } catch (error) {
//     // console.log(err.stack);
//     // console.log(err.message);
//     next(error.message);
//   }
// };

const createModule = async (req, res, next) => {
  try {
    // Get the course ID from the request parameters
    const courseId = req.params.courseId;

    // Find the course in the database
    const course = await Course.findById(courseId);

    // Return an error if the course doesn't exist
    if (!course) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Course not found" });
    }

    // Get the module data from the request body
    const { name, title, modulePicture, lessons, liveClassURL, recordedClassURL } = req.body;

    // Check if all required fields are present
    if (!name || !title || !lessons || !liveClassURL) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are mandatory" });
    }

    // Check if a module with the same title already exists for this course
    const moduleExists = await Module.findOne({
      "courseModule.title": title,
      "course": course._id,
    });

    if (moduleExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Module already exists for this course" });
    }

    // Create the module object
    const moduleData = {
      courseModule: { name, title, modulePicture },
      lessons: [{
        name: lessons[0].lessonName,
        title: lessons[0].lessonTitle,
        description: lessons[0].description,
        fileURL: lessons[0].fileURL,
      }],
      liveClassURL,
      recordedClassURL,
      course: course._id,
    };

    // Create the module in the database
    const createdModule = await Module.create(moduleData);

    // Add the new module to the course's list of modules
    course.modules.addToSet(createdModule._id);
    await course.save();

    // Return the newly created module
    res.status(StatusCodes.CREATED).json({ module: createdModule });
  } catch (error) {
    next(error.message);
  }
};

const updateModule = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;

    // validating the module exist in the db
    const module = await Module.findById(moduleId);
    if (!module) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Module not found!" });
    }

    // ensuring that all necessary properties are sent from the client
    const { name, title, modulePicture, lessons, liveClassURL, recordedClassURL } = req.body;

    // validating the all the properties from the client
    if (!name || !title || !lessons || !liveClassURL) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields mandatory!" });
    }

    // updating the module in the db
    module.courseModule.name = name;
    module.courseModule.title = title;
    module.courseModule.modulePicture = modulePicture;
    module.lessons = [{
      name: lessons[0].lessonName,
      title: lessons[0].lessonTitle,
      description: lessons[0].description,
      fileURL: lessons[0].fileURL,
    }];
    module.liveClassURL = liveClassURL;
    module.recordedClassURL = recordedClassURL;
    await module.save();

    res.status(StatusCodes.OK).json({ message: "Module updated successfully!" });
  } catch (error) {
    next(error.message);
  }
};



module.exports = {
  getAllModules,
  getModule,
  createModule,
  updateModule
};