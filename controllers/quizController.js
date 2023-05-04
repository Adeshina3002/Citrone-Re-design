const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel');
const Module = require("../models/moduleModels");
const Score = require("../models/scoreModel")
const { StatusCodes } = require('http-status-codes');

const createQuiz = async (req, res, next) => {
    try {
        const moduleId = await Module.findById({_id: req.params.moduleId}).select('courseModule.name courseModule.title');
        console.log(moduleId);

        if (!moduleId) return res.status(StatusCodes.NOT_FOUND).json({
            status: "Error",
            message: "Module not found"
        })

        const { questionLists, answers } = req.body

        console.log(req.body);

        if (!questionLists || !answers) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Error",
                message: "You need to provide questions and answers to create a quiz"
            })
        }

        const quizQuestions = questionLists.map((question) => ({
            questionNumber: question.questionNumber,
            question: question.question,
            options: question.options
        }));

        const quizAnswers = answers.map((answer) => ({
            questionNumber: answer.questionNumber,
            answer: answer.answer
        }));

        const quiz = await Quiz.create({
            moduleID: moduleId._id,
            moduleName: moduleId.courseModule.name,
            moduleTitle: moduleId.courseModule.title,
            questionLists: quizQuestions,
            answers: quizAnswers
          });

        res.status(StatusCodes.CREATED).json({status: "success", message: "Quiz created successfully", quiz})

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
        // next(error.stack)
    }
}

const getQuiz = async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "Quiz not found",
        });
      }
  
      const quizQuestions = quiz.questionLists;
      const quizAnswers = quiz.answers;
  
      // Create an object to hold the questions, options, and selected answers
      const questionsWithOptions = quizQuestions.map((question) => {
        // Get the index of the answer for this question
        const answerIndex = quizAnswers.findIndex(
          (answer) => answer.questionNumber === question.questionNumber
        );

        // Set the selected answer to null by default
        let selectedOption = null;

        // If an answer has already been submitted for this question, set the selected answer to that answer

        if (answerIndex !== -1) {
          selectedOption = quizAnswers[answerIndex].answers;
        }

        return {
          questionNumber: question.questionNumber,
          question: question.question,
          options: question.options,
          selectedOption: selectedOption,
        };
      });
  
      res.status(StatusCodes.OK).json({ quizQuestions: questionsWithOptions });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Could not get quiz",
      });
    }
  };

  const submitQuiz = async (req, res, next) => {
    try {
      const { quizId } = req.params;
      const studentId = req.user.userId;
      const { answers } = req.body;
  
      // Get quiz
      const quiz = await Quiz.findById(quizId);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: "Error",
          message: "Quiz not found",
        });
      }
  
      // Calculate score
      let correctAnswers = 0;
      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];

        const question = quiz.questionLists.find(
          (q) => q.questionNumber === answer.questionNumber
        );
        if (!question) {
            continue;
        }
        if (question.options[answers.answer] === true) {
          correctAnswers++;
        }
      }
      const score = Math.round((correctAnswers / quiz.questionLists.length) * 100);
      console.log(score);
  
      // Save score
      const scoreObj = await Score.create({
        studentId,
        quizId,
        score,
      });
  
      res.status(StatusCodes.OK).json({
        status: "Success",
        message: "Quiz submitted successfully",
        score: scoreObj,
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
  };
  

// const updateQuiz = async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// }

// const deleteQuiz = async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// }

module.exports = {
    createQuiz,
    getQuiz,
    submitQuiz
}