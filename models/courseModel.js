const mongoose = require("mongoose")

const CourseSchema = mongoose.Schema({
    track: {
        type: String,
        enum: ["UI/UX", "Backend", "Frontend", "Data Science"],
        required: true
    },
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    }],
    level: {
        type: String,
        enum: ["Beginner level", "Intermediate level"], 
        required: true
    },
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
    { timestamps: true }
)

module.exports = mongoose.model("Course", CourseSchema)