const express = require("express")
const { allUser, searchUser, currentUser } = require("../controllers/userController")
const {isTokenValid} = require("../utils")
const router = express.Router()

router.get("/", allUser)
router.get('/search', isTokenValid, searchUser)
router.get('/current', isTokenValid, currentUser)


module.exports = router 