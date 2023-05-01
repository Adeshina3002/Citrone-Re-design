const mongoose = require("mongoose")

const attemptSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    answers: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      selectedOption: {
        type: Number,
        required: true
      }
    }],
    score: {
      type: Number,
      default: null
    },
    attempt: {
      type: Number,
      default: 1,
      unique: true
    },
    graded: {
      type: Boolean,
      default: false
    },
    attemptTime: {
      type: Date,
      default: Date.now,
      required: true
    }
  });
  
  module.exports = mongoose.model('Attempt', attemptSchema);