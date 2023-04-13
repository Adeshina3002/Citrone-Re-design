const mongoose = require('mongoose');


const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"]
    },

    title: {
        type: String,
        required: [true, "Please provide title"]
    },

    author: {
        type: String,
        required: [true, "Please provide author"]
    }, 

    assignment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "assignment"
    }],
    
    quiz: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz"
    }]
})
const Course = mongoose.model('courses', coursesSchema)
module.exports = Course;