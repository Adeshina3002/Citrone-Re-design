const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizModel');
const Module = require("../models/moduleModels");
const { StatusCodes } = require('http-status-codes');

const createQuiz = async (req, res) => {
    try {
        const moduleId = await Module.findById({_id: req.params.moduleId}).select('courseModule.name courseModule.title');

        if (!moduleId) return res.status(StatusCodes.NOT_FOUND).json({
            status: "Error",
            message: "Module not found"
        })

        const { questionLists, answers } = req.body

        if (!questionLists || !answers) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: "Error",
                message: "You need to provide questions and answers to create a quiz"
            })
        }

        const quiz = await Quiz.create({
            moduleName: moduleId.courseModule.title,
            questionLists,
            answers
          });

        res.status(StatusCodes.CREATED).json({status: "success", message: "Quiz created successfully", Questions: quiz.questionLists})

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
    }
}

// const getQuiz = async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// }

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
    createQuiz
}