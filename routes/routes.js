const express = require("express");
const Joi = require("joi");
const router = express.Router();
const {Deletequiz,Createquiz,getAllquizzes}=require('../controllers/quizzes')
const {DeleteAnswer,StoreAnswer,getAllAnswers}= require("../controllers/answers")
router.route('/')
        .get(getAllquizzes) /** GET Request */
        .post(Createquiz) /** POST Request */
        .delete(Deletequiz) /** DELETE Request */

router.route('/answers')
        .get(getAllAnswers)
        .post(StoreAnswer)
        .delete(DeleteAnswer)



module.exports = router