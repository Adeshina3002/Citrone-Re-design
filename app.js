// modules 
const express = require("express")
const { StatusCodes } = require("http-status-codes")
const morgan = require("morgan")
const connectDB = require("./db/connect")
require("dotenv").config()
const path = require('path');


const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public")
    }, 

    filename: ( req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({storage: storage})

//importing the courses router
const coursesRouter = require('./routes/courses'); 


const app = express()
const PORT = process.env.PORT || 3000 
//setting the view engine
app.set('views', path.join(__dirname, 'view'))
app.set('view engine', 'ejs')

// application middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
 


//router middleware  
app.use('/api/course', coursesRouter);


app.get("/", (req, res) => { 
    console.log("check again...");
    res.status(200).json({message: "Welcome..."})
})

app.get("/", (req, res) => {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid Url, please try again"});
})


app.get('/upload', (req, res) => {
    res.render('index')
})

app.post('/upload', upload.single('courseSlides'), (req, res) => {  
    res.send('Image Upload')
});

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

start();
