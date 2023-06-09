const express = require("express")
const { allUser, searchUser, currentUser, getUser } = require("../controllers/userController")
const {isTokenValid} = require("../utils")
const router = express.Router()

// GET METHODS
router.get("/", allUser)
router.get("/user/:email", isTokenValid, getUser)
router.get('/search', isTokenValid, searchUser)
router.get('/current', isTokenValid, currentUser)

// PUT METHODS



module.exports = router 