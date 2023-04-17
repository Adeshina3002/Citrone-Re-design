const mongoose = require("mongoose")

const assignmentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lesson",
        required: true
    },
    submittedBy: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    submittionURL: {
        type: String,
        required: true
    }, 
    submissionDate: {
        type: Date
    },
    dueDate: {
        type: Date,
        required: true
    }
}, 
{timestamps: true}
)


module.exports = mongoose.model("Assignment", assignmentSchema)