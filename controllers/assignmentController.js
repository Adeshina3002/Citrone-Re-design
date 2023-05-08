const Assignment = require("../models/assignmentModel")
const Course = require("../models/courseModel")
const Module = require("../models/moduleModels")
const { StatusCodes } = require("http-status-codes")

// // Assignment creation by the tutor 
// const createAssignment = async (req, res) => {
//     // try {
//     //     const module = await Course.findOne({_id: req.body.moduleId})
//     //     const lessonName = module.modules.name

//     //     const newAssignment = {
//     //         title: req.body.title,
//     //         description: req.body.description,
//     //         lesson: lessonName,
//     //         submission_Field: req.body.submission_Field,
//     //         submissionDate: new Date(),
//     //         dueDate: new Date(req.body.dueDate)
//     //     }

//     //     if (!newAssignment.title || !newAssignment.description || !newAssignment.lesson || !newAssignment.submission_Field || !newAssignment.submissionDate || !newAssignment.dueDate) {
//     //         return res.status(StatusCodes.BAD_REQUEST) .json({message: "All fields are mandatory"})
//     //     }

//     // Check if the current date is greater than the due date
//     // const currentDate = new Date()

//     //     let assignment = await Assignment.create(newAssignment)

//     //     res.status(StatusCodes.CREATED).json(assignment)

//     // } catch (error) {
//     //     res.status(StatusCodes.BAD_REQUEST).json(error.message)
//     // }

//     try {
//         const moduleId = req.params.moduleId;
    
//         const moduleInfo = await Module.findOne({ _id: moduleId }).select("courseModule.name courseModule.title lesson.name lesson.title");
    
//         if (!moduleInfo) {
//           return res.status(StatusCodes.NOT_FOUND).json({ message: 'Module not found' });
//         }
    
//         const newAssignment = {
//           title: moduleInfo.courseModule.title,
//           description: req.body.description,
//           lesson: moduleInfo.lesson.title,
//           submissionDate: new Date(),
//           dueDate: new Date(req.body.dueDate),
//         };
    
//         const requiredFields = ['title', 'description', 'lesson', 'submissionDate', 'dueDate'];
//         const missingFields = [];
    
//         requiredFields.forEach((field) => {
//           if (!newAssignment[field]) {
//             missingFields.push(field);
//           }
//         });
    
//         if (missingFields.length > 0) {
//           return res.status(StatusCodes.BAD_REQUEST).json({
//             message: `The following fields are required: ${missingFields.join(', ')}`,
//           });
//         }
    
//         const assignment = await Assignment.create(newAssignment);
    
//         res.status(StatusCodes.CREATED).json(assignment);
//       } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json(error.message);
//       }
// }

// const createAssignment = async (req, res, next) => {
//   try {
//     const moduleId = req.params.moduleId;

//     const moduleInfo = await Module.findOne({ _id: moduleId }).select("courseModule.name courseModule.title lesson.name lesson.title");

//     if (!moduleInfo) {
//       return res.status(StatusCodes.NOT_FOUND).json({ message: 'Module not found' });
//     }

//     const assignment = new Assignment({
//       title: moduleInfo.courseModule.title,
//       description: req.body.description,
//       lesson: moduleInfo.lesson.title,
//       submissionDate: new Date(),
//       dueDate: new Date(req.body.dueDate),
//     });

//     const requiredFields = ['title', 'description', 'lesson', 'submissionDate', 'dueDate'];

//     if (!requiredFields.every(field => assignment[field])) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         message: `The following fields are required: ${requiredFields.filter(field => !assignment[field]).join(', ')}`,
//       });
//     }

//     await assignment.save();

//     res.status(StatusCodes.CREATED).json(assignment);
//   } catch (error) {
//     next (error.message)
//   }}
     


// submitting an assignment

const createAssignment = async (req, res, next) => {
  try {
    const moduleId = req.params.moduleId;

    const moduleInfo = await Module.findOne({ _id: moduleId }).select("courseModule.name lessons.name");

    if (!moduleInfo) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Module not found' });
    }

    const newAssignment = {
      title: moduleInfo.courseModule.name,
      description: req.body.description,
      lesson: moduleInfo.lessons.name,
      dueDate: new Date(req.body.dueDate),
      assignementStatus: "Awaiting Grade"
    };

    const requiredFields = ['description', 'dueDate'];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!newAssignment[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `The following fields are required: ${missingFields.join(', ')}`,
      });
    }

    const assignment = await Assignment.create(newAssignment);

    res.status(StatusCodes.CREATED).json(assignment);
  } catch (error) {
    next(error.message)
  }
};



// const submitAssignment = async (req, res) => {
//     try {
//         const { studentId, assignmentId, submission_Field } = req.body

//         if (!submission_Field) {
//             return res.status(StatusCodes.BAD_REQUEST).json({message: "Error submitting your assignment link"})
//         }

//         const foundAssignment = await Assignment.findOne({_id: assignmentId})

//         if (!foundAssignment) {
//             return res.status(StatusCodes.NOT_FOUND).json({message: "Assignment not found"})
//         }

//         // Check if the current date is greater than the due date
//         const currentDate = new Date()
//         let status = "submitted on time";
//         if (currentDate > foundAssignment.dueDate) {
//             status = "late submission";

//         return res.status(StatusCodes.BAD_REQUEST).json({message: "The due date for this assignment has passed. You cannot submit this assignment."})
//     }

//     const submitAssignment = {
//         submittedBy: studentId,
//         submission_Field,
//         submissionDate: Date.now(),
//         status
//     }

//         // const status = submitAssignment.status 
//         const submittedAssignment = await Assignment.create(submitAssignment)

//         res.status(StatusCodes.CREATED).json({status: "Success", message: "Assignment created successfully", submittedAssignment })

//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json(error.message)
//     }
// }

// const getAllAssignment = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;
    
//         const assignments = await Assignment.find({})
//           .populate("submittedBy", "-password firstName lastName")
//           .sort({ createdAt: -1 })
//           .skip(startIndex)
//           .limit(limit);
    
//         const total = await Assignment.countDocuments();
    
//         if (assignments.length === 0) {
//           return res.status(StatusCodes.NOT_FOUND).json({
//             message: "No submitted assignments at this moment",
//           });
//         }
    
//         const pagination = {
//           currentPage: page,
//           totalPages: Math.ceil(total / limit),
//         };
    
//         res.status(StatusCodes.OK).json({ assignments, pagination });
//       } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json(error.message);
//       }
// }

const submitAssignment = async (req, res, next) => {
  try {
    const { submissionField, submissionFile } = req.body
    const { id } = req.params

    const assignment = await Assignment.findById(id)
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" })
    }

    const now = new Date()
    if (now > assignment.dueDate) {
      return res.status(400).json({ message: "Assignment submission is overdue" })
    }

    assignment.submittedBy = req.user._id
    assignment.submissionFile = submissionFile
    assignment.submissionField = submissionField

    if (!submissionField || !submissionFile) {
      return res.status(StatusCodes.BAD_REQUEST).json({status: "Error", message: "You are yet to submit the result for your assignment"})
    }

    if (req.file) {
      assignment.submissionFile = req.file.path
    }
    assignment.submissionDate = now
    assignment.status = "Awaiting Grade"
    assignment.submissionField = req.body.submissionField

    await assignment.save()
    res.status(200).json(assignment)
  } catch (error) {
    // res.status(500).json({ message: err.message })
    next(error.message)
  }
}


const getAllAssignment = async (req, res, next) => {
  try {
    const assignments = await Assignment.find({});

    if (!assignments) {
      return res.status(StatusCodes.BAD_REQUEST).json({status: "OK", message: "No assignment yet, check back later"})
    }

    res.status(StatusCodes.OK).json(assignments);
  } catch (error) {
    // res.status(StatusCodes.BAD_REQUEST).json(error.message);
    next (error.message)
  }
};


const getAssignment = async (req, res, next) => {
    try {
        const assignment = await Assignment.findOne({ _id: req.params.id });

        if (!assignment) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'Assignment not found' });
        }

        res.status(StatusCodes.OK).json(assignment);
      } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
        // next(error.message)
      }
}


const scoreAssignment = async (req, res, next) => {
  try {
    const submittedAssignment = await Assignment.find({ _id: req.params.assignmentId }).populate("submittedBy submittionField submittedFile");

    if (!submittedAssignment) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Assignment not found' }).populate("submittedBy submittedField submittedFile submissionDate");
    }

    submittedAssignment.grade = req.body.grade;
    submittedAssignment.tutorComment = req.body.tutorComment;
    submittedAssignment.status = "Graded";
    // submittedAssignment.createdDate = new Date();

    if (!submittedAssignment.grade) {
      return res.status(StatusCodes.BAD_REQUEST).json({status: "", message: "Please provide the assignement grade"})
    }

    await submittedAssignment.save();

    res.status(StatusCodes.OK).json({ status: "Success", message: 'Assignment graded successfully' });
  } catch (error) {
    // res.status(StatusCodes.BAD_REQUEST).json(error.message);
    next(error.message)
  }
};


module.exports = {
    createAssignment,
    submitAssignment,
    getAllAssignment,
    getAssignment,
    scoreAssignment
}
