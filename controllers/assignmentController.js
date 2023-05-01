const Assignment = require("../models/assignmentModel")
const Course = require("../models/courseModel")
const Module = require("../models/moduleModels")
const { StatusCodes } = require("http-status-codes")

// // Assignment creation by the tutor 
const createAssignment = async (req, res) => {
    // try {
    //     const module = await Course.findOne({_id: req.body.moduleId})
    //     const lessonName = module.modules.name

    //     const newAssignment = {
    //         title: req.body.title,
    //         description: req.body.description,
    //         lesson: lessonName,
    //         assignmentUrl: req.body.assignmentUrl,
    //         submissionDate: new Date(),
    //         dueDate: new Date(req.body.dueDate)
    //     }

    //     if (!newAssignment.title || !newAssignment.description || !newAssignment.lesson || !newAssignment.assignmentUrl || !newAssignment.submissionDate || !newAssignment.dueDate) {
    //         return res.status(StatusCodes.BAD_REQUEST) .json({message: "All fields are mandatory"})
    //     }

    // Check if the current date is greater than the due date
    // const currentDate = new Date()

    //     let assignment = await Assignment.create(newAssignment)

    //     res.status(StatusCodes.CREATED).json(assignment)

    // } catch (error) {
    //     res.status(StatusCodes.BAD_REQUEST).json(error.message)
    // }

    try {
        const moduleId = req.body.moduleId;
    
        const moduleName = await Module.findOne({ _id: moduleId }).populate("Module");
    
        if (!moduleName) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'Module not found' });
        }
    
        const newAssignment = {
          title: req.body.title,
          description: req.body.description,
          lesson: moduleName,
          assignmentUrl: req.body.assignmentUrl,
          submissionDate: new Date(),
          dueDate: new Date(req.body.dueDate),
        };
    
        const requiredFields = ['title', 'description', 'lesson', 'assignmentUrl', 'submissionDate', 'dueDate'];
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
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
}

// submitting an assignment
const submitAssignment = async (req, res) => {
    try {
        const { studentId, assignmentId, submissionUrl } = req.body

        if (!submissionUrl) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Error submitting your assignment link"})
        }

        const foundAssignment = await Assignment.findOne({_id: assignmentId})

        if (!foundAssignment) {
            return res.status(StatusCodes.NOT_FOUND).json({message: "Assignment not found"})
        }

        // Check if the current date is greater than the due date
        const currentDate = new Date()
        let status = "submitted on time";
        if (currentDate > foundAssignment.dueDate) {
            status = "late submission";

        return res.status(StatusCodes.BAD_REQUEST).json({message: "The due date for this assignment has passed. You cannot submit this assignment."})
    }

    const submitAssignment = {
        submittedBy: studentId,
        submissionURL: submissionUrl,
        submissionDate: Date.now(),
        status
    }

        // const status = submitAssignment.status 
        const submittedAssignment = await Assignment.create(submitAssignment)

        res.status(StatusCodes.CREATED).json(submittedAssignment)

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
    }
}

const getAllAssignment = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const assignments = await Assignment.find({})
          .populate("submittedBy", "-password firstName lastName")
          .sort({ createdAt: -1 })
          .skip(startIndex)
          .limit(limit);
    
        const total = await Assignment.countDocuments();
    
        if (assignments.length === 0) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "No submitted assignments at this moment",
          });
        }
    
        const pagination = {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        };
    
        res.status(StatusCodes.OK).json({ assignments, pagination });
      } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
}

const getAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findOne({ _id: req.params.id }).populate('submittedBy', '-password firstName lastName');

        if (!assignment) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'Assignment not found' });
        }

        res.status(StatusCodes.OK).json(assignment);
      } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
      }
}

module.exports = {
    createAssignment,
    submitAssignment,
    getAllAssignment,
    getAssignment
}