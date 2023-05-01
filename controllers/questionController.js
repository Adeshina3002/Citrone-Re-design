const Module = require("../models/moduleModels.js")
const Question = require("../models/questionModel.js")
const {StatusCodes} = require("http-status-codes")


const quizQuestions = async (req, res) => {
    try {
        const isModule = await Module.findById({_id: req.params.moduleId})

        if (!isModule) return res.status(StatusCodes.NOT_FOUND).json("Module not found")

        // create a new question instance from the request body
        const question = new Question({
          module: isModule.courseModule.title,
          question: req.body.question,
          options: req.body.options,
        });
    
        // save the question to the database
        await question.save();
    
        res.status(201).json({ message: 'Question created successfully' });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}


module.exports = {
    quizQuestions
}