const Assignment = require("../models/assignmentModel")
const Course = require("../models/courseModels")
const { StatusCodes } = require("http-status-codes")

const submitAssignment = async (req, res) => {
    try {
        const lessonId = await Course.findOne({ _id: req.body.lessonId })

        if (!lessonId) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "Provide a valid lessonId"})
        }

        const newAssignment = {
            title: res.body,
            description: req.body,
            submittedBy: req.user.userId,
            submittionURL: req.body,
            submissionDate: new Date.now(),
            dueDate: new Date(), 
            lesson: lessonId
        }

        let assignment = await Assignment.create(newAssignment)

        // assignment = await assignment.populate([
        //     {path: "users", "-password firstName lastName"}
        // ])

    } catch (error) {
        
    }
}

module.exports = {
    submitAssignment
}