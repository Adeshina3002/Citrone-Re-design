const express = require('express');
const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

const Course = require('../models/courses')

//GETTING ALL COURSES
const getAllCourses = async (req, res) => {
    try{
        const courses = await Course.find().sort("name")
        if(courses.length === 0){
            res.status(StatusCodes.NOT_FOUND).json({message: "courses not found"})
            return
        }
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const result = {};
        if(endIndex < courses.length){
            result.next = {
                page: page + 1,
                limit: limit,
            }
        }

        if (startIndex > 0) {
            result.prev = {
                page: page - 1,
                limit: limit,
            }
        }

        result.results = courses.slice(startIndex, endIndex);
        

      //for(i = 0; i < courses.length; i++){
      //         await courses[i].populate('assignment', {name: 1, _id: 0 }).populate('quiz', {name: 1, _id: 0})
      //}
    
        res.status(StatusCodes.OK).json({message: "All available courses", courses})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send(error.message)
    }
}

//CREATING COURSES 
const createCourse = async (req, res) => {
    try{
        const { name, title, author } = req.body

        const schema = Joi.object({
            name: Joi.string().required(),
            title: Joi.string().required(),
            author: Joi.string().required(),
            
        });
        const result = schema.validate(req.body)

        if(result.error){
            res.status(StatusCodes.BAD_REQUEST).send(result.error.details[0].message)
        }

         const titleExist = await Course.findOne({ title });
         if(titleExist){
            res.status(StatusCodes.BAD_REQUEST).json({message: "title already exists"})
            return
         }

        const course = await Course.create({ name, title, author}) 
        res.status(StatusCodes.CREATED).json({message: 'Course created successfully', course })
    } catch(error) {
        res.status( StatusCodes.NOT_ACCEPTABLE).json({error})
    }
} 


//GETTING COURSE BY ID
const getCourseById = async (req, res) => {
    try {

        const { id } = req.params

        if(!id){
            res.status(StatusCodes.BAD_REQUEST).json({message: "please provide ID"})
            return
        }
        const course = await Course.findById({_id: id})
        if(!course){
        res.status(StatusCode.BAD_REQUESTs).json({message: `Course with ID ${req.params.id} not found`})
            return
        }

        res.status( StatusCodes.OK).json({message: "Course found", course})

    } catch (error) {
        res.status( StatusCodes.NOT_ACCEPTABLE).json({error})

    }
};

//UPDATING THE COURSE DATA
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params
        if ( !id ){
            res.status(StatusCodes.BAD_REQUEST).json({message: `Id ${req.params.id} does not exist`})
            return
        }

        const updateCourse = await Course.findOne({ id })
        if(!updateCourse){
            res.status(StatusCodes.NOT_FOUND).json({message: 'Course not found'})
            return
        }

        const { name, title, author } = req.body

        const schema = Joi.object({
            name: Joi.string().required(),
            title: Joi.string().required(),
            author: Joi.string().required(),
            
        });
        const result = schema.validate(req.body)

        if(result.error){
            res.status(StatusCodes.BAD_REQUEST).send(result.error.details[0].message)
        }

        const newCourse = await Course.updateOne({id: updateCourse.id}, req.body)
        res.status(StatusCodes.ACCEPTED).json({message: "Course was successfully updated", newCourse})


    } catch (error) {
        res.status( StatusCodes.NOT_ACCEPTABLE).json({error})
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params

    if (!id){
        res.status(StatusCodes.BAD_REQUEST).json({message: 'please provide ID'})
        return
    }

    const deleteCourse = await Course.deleteOne({_id: id})
    if(!deleteCourse){
        res.status(StatusCodes.NOT_FOUND).json({message: 'Course not found'})
        return
    }

    res.status(StatusCodes.GONE).json({message: 'Course successfully deleted'})
    } catch (error) {
        res.status( StatusCodes.NOT_ACCEPTABLE).json({error})
    }

}


module.exports = {
    getAllCourses,
    createCourse, 
    getCourseById,
    updateCourse,
    deleteCourse
}