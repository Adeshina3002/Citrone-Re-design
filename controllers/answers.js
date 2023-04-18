const quizzes=require("../db/models/answers")
const { StatusCodes } = require('http-status-codes')
const answers = require("../db/models/answers")

const getAllAnswers = async (req,res)=>{
    try {
      const answer= await answers.find()
      if (answer.length === 0){
        return res.status(StatusCodes.NOT_FOUND).json({message:"no answers at this moment"})}
        res.status(StatusCodes.OK).json({answer})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error})
    }
}

const StoreAnswer = async (req,res)=>{
    try {
        const {username,answers,attempts,points,achived} = req.body
        if (!username && !answers){
        return res.status(StatusCodes.NOT_FOUND).json({message:"no answers at this moment"})}
      await answers.create({username,answers,attempts,points,achived})
            .then(function ()  {
            res.json({msg :"Answers saved succesfully"})
            })
    } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).json({error})
    }
}

const DeleteAnswer = async (req,res)=>{
    try {
        await answers.deleteMany()
        res.json({msg: "answers deleted succesfully"})
    } catch (error) {
        res.json({error})
    }
}

module.exports = {DeleteAnswer,StoreAnswer,getAllAnswers};