const Module = require("../models/moduleModels");
const Course = require("../models/courseModel");
const { StatusCodes } = require("http-status-codes");


// Getting all modules
const getAllModules = async (req, res, next) => {
  try {
    const modules = await Module.find();
    if (modules.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Module not found!" });
    }
    res.status(StatusCodes.OK).json({ message: modules });
  } catch (err) {
    next(err.message);
  }
};


// Get a module
const getModule = async (req, res, next) => {};


// Creating a module
const createModule = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res
        .status(StatusCodes)
        .json({ message: "Course does not exist!" });
    }
    const courseModule = {
      name: req.body.name,
      title: req.body.title,
      modulePicture: req.body.modulePicture
    };
    const lesson = {
      name: req.body.lessonName,
      title: req.body.lessonTitle,
      description: req.body.description,
      fileUrl: req.body.fileUrl,
    };
    const { liveClassUrl, recordedClassUrl } = req.body;
    // const {
    //   courseModule: { name: moduleName, title, modulePicture },
    //   lesson: { name: lessonName, title: lessonTitle, content, fileUrl },
    //   liveClassUrl,
    //   recordedClassUrl,
    // } = req.body;
    if (
      !courseModule.name ||
      !courseModule.title ||
      !lesson.name ||
      !lesson.title ||
      !lesson.description ||
      !lesson.fileUrl ||
      !liveClassUrl
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields mandatory!" });
    }
    //const moduleExist = await Module.exists({ courseModule });
    //const moduleExist = await Module.find(courseModule.name);
    if (moduleExist) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Module already created!" });
    }
    const createdModule = await Module.create({
      courseModule: {
        name: req.body.name,
        title: req.body.title,
        modulePicture: req.body.modulePicture,
      },
      lesson: {
        name: req.body.lessonName,
        title: req.body.lessonTitle,
        description: req.body.description,
        fileUrl: req.body.fileUrl,
      },
      liveClassUrl: req.body.liveClassUrl,
      recordedClassUrl: req.body.recordedClassUrl,
      course: course._id,
    });
    course.modules.addToSet(createdModule._id);
    course.save();
    res.status(StatusCodes.CREATED).json({ module: createdModule });
  } catch (err) {
    console.log(err.stack);
    console.log(err.message);
    next(err.message);
  }
};


module.exports = {
  getAllModules,
  getModule,
  createModule,
};