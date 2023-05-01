const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  isAnswer: {
    type: Boolean,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  questions: {
    type: String,
    required: true,
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (options) {
        return options.some((option) => option.isAnswer === true);
      },
      message: 'At least one option must be marked as the correct answer',
    },
  },
});

module.exports = mongoose.model('Question', questionSchema);
