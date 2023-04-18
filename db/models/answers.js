const {Schema, default: mongoose}=require("mongoose");

const AnswersModel =new Schema({
   username : {type : String},
    answers : {type:Array, default: []},
    attempts : {type : Number, default : 0},
    points : {type :Number, default : 0},
    achived : {type : String, default : ""},
    createdAt: {type :Date,default: Date.now}
})

const  answers =mongoose.model("answers",AnswersModel)

module.exports = answers;