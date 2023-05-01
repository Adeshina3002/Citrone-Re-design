const mongoose = require("mongoose")

const quizSchema = new mongoose.Schema({
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true
    },
    numQuestions: {
      type: Number,
      required: true
    },
    timeLimit: {
      type: Number,
      required: true
    },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }],
    graded: {
      type: Boolean,
      default: false
    },
    attempts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attempt'
    }]
  });
  
  quizSchema.pre('save', function (next) {
    this.numQuestions = this.questions.length;
    next();
  });

  module.exports = mongoose.model("Quiz", quizSchema)
  