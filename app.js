// modules 
const express = require("express")
const { StatusCodes } = require("http-status-codes")
const morgan = require("morgan")
const connectDB = require("./db/connect")
require("dotenv").config()
const quizRoute = require('./routes/routes')
const app = express()
const PORT = process.env.PORT || 3000 

// application middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/quiz',quizRoute)

app.get("/", (req, res) => {
    console.log("check again...");
    res.status(200).json({message: "Welcome..."})
})

app.get("*", (req, res) => {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error ("Invalid Url, please try again")
})

// database and server connection 
const start = async () => {
    try {
        await connectDB(process.env.Mongo_URI) // please include your db connection string in the .env file
        console.log("Database connected...")
        app.listen(PORT, () => {
            console.log(`Server connected to http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log("Unable to connect", error.message);
    }
}

start()
