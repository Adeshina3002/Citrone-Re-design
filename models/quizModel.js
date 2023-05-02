const mongoose = require("mongoose")

const quizSchema = mongoose.Schema({
    moduleName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
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
            }
        }
      ],
      answers: {}
},
    {timestamps: true}
)

module.exports = mongoose.model("Quiz", quizSchema)