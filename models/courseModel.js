const mongoose = require("mongoose")

const CourseSchema = mongoose.Schema({
    courseName: {
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
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},
    { timestamps: true }
)

module.exports = mongoose.model("Course", CourseSchema)