// modules 
const express = require("express")
const morgan = require("morgan")
const connectDB = require("./db/connect")
const cookieParser = require("cookie-parser")
const userRoutes = require("./routes/userRoutes")
const authRoutes = require("./routes/authRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const assignmentRoutes = require("./routes/assignmentRoutes")
const courseRoutes = require("./routes/courseRoutes")
const moduleRoutes = require("./routes/moduleRoutes")
const quizRoutes = require("./routes/quizRoutes")
const tutorsRoutes = require("./routes/tutorsRoutes")
const {StatusCodes} = require("http-status-codes")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000 

// application middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.urlencoded({extended: false}))

// routes
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/assignment", assignmentRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/module", moduleRoutes)
app.use("/api/quiz", quizRoutes)
app.use("/api/tutors", tutorsRoutes)

// Get method for the root route
app.get("/api", (req, res) => {
    res.status(StatusCodes.OK).json({ message: "API is running successfully" })
})

// incase of invalid routes from the client
app.get("*", (req, res) => {
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid URL" })
})

// database, socket.io and server connection 
const start = async () => {
    try {
        await connectDB(process.env.Mongo_URI) 
        console.log("Database connected...")
        const server = app.listen(PORT, () => {
            console.log(`Server connected to http://localhost:${PORT}`)
        })

        // connecting socket.io
        const io = require("socket.io")(server, {
            pingTime: 60000, // taking 60seconds of inactivity to disconnect
            cors: {
                origin: `http://localhost:${PORT}`
            }
        })
        
        io.on("connection", (socket) => {
            console.log("Connected to socket.io");

        // to fetch user data from the client
        socket.on("setup", (userData) => {
            socket.join(userData._id);
            console.log(userData._id);
            socket.emit("connected")
        })

        // joining the group chat from the client
        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User joined Room: " + room)
        })

        // Typing functionality using socket.io
        socket.on("typing", (room) => socket.in(room).emit("typing"))
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

        // sending new message on the client
        socket.on("new message", (newMessageRecieved) => {
            let chat = newMessageRecieved.chat

            if (!chat) {
                return console.log("chat.users not define");
            }

            // allow the sent message gets recieved by all the users in a group aside from the user sending the message
            chat.users.forEach(user => {
                if (user._id == newMessageRecieved.sender._id) return 

                socket.in(user._id).emit("message recieved", newMessageRecieved)
            })
        })

        // clean up the socket to avoid too consumption of bandwidth
        socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            socket.leave(userData._id)
        })
        })
       
    } catch (error) {
        console.log("Unable to connect", error.message);
    }
}

start()
