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
    assignmentURL: {
        type: String
    },
    submittedBy: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    submissionURL: {
        type: String
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
    status: {
        type: String       
    }
}, 
{timestamps: true}
)


module.exports = mongoose.model("Assignment", assignmentSchema)