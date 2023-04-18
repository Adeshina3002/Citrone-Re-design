const quizzes=require("../db/models/quizzes")
const { StatusCodes } = require('http-status-codes')
// const {Questions} =require("../db/data")
const { questions,answers } =require("../db/data")

const getAllquizzes = async (req,res)=>{
    try {
    const quiz= await quizzes.find()
    if (quiz.length === 0){
        return res.status(StatusCodes.NOT_FOUND).json({message:"no quiz at this moment"})
    }
        res.status(StatusCodes.OK).json({quiz})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error})
    }
    }

    const Createquiz = async (req,res)=>{
        try {
          await quizzes.insertMany({ questions, answers })
            .then(function ()  {
                res.json({msg : "data saved succesfully"})
            })
           
        } catch (error) {
            res.json(error.message)
        }
    }
    const Deletequiz = async (req,res)=>{
        try {
            await quizzes.deleteMany()
            res.json({msg: "Questions deleted succesfully"})
        } catch (error) {
            res.json({error})
        }
    }

    module.exports = {Deletequiz,Createquiz,getAllquizzes};