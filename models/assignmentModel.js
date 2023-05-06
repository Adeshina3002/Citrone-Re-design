const mongoose = require("mongoose")

const assignmentSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    },
    submittedBy: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    submissionField: {
        type: String
    }, 
    submissionFile: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    submissionDate: {
        type: Date
    },
    dueDate: {
        type: Date
    }, 
    grade: {
        type: Number
    },
    assignementStatus: {
        type: String,
        enum: ["Open", "Awaiting Grade", "Graded"],
        default: "Open"     
    },
    tutorComment: {
        type: String       
    }
}, 
{timestamps: true}
)


module.exports = mongoose.model("Assignment", assignmentSchema)