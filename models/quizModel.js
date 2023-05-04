const mongoose = require("mongoose")

const quizSchema = mongoose.Schema({
      moduleID: {
        type: String,
        required: true
      },
      moduleName: {
        type: String,
        required: true
      },
      moduleTitle: {
        type: String,
        required: true
      },
      questionLists: [
        {
            questionNumber: {
                type: Number,
                required: true
            },
            question: {
                type: String, 
                required: true
            },
            options: {
                type: Object,
                required: true
            }
        }
      ],
      answers: [
        {
            questionNumber: {
                type: Number,
                required: true
            },
            answer: {
                type: String,
                required: true
            }
        }
      ]
},
    {timestamps: true}
)

module.exports = mongoose.model("Quiz", quizSchema)