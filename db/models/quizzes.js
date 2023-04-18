const {Schema, default: mongoose}=require("mongoose");

const QuestionModel =new Schema({
    questions : {type : Array, default : []},
    answers : {type:Array, default: []},
    createdAt: {type :Date,default: Date.now}
})

const  questions =mongoose.model("questions",QuestionModel)

module.exports = questions;