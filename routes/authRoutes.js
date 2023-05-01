const express = require("express")
const { createAccount, login, logout, generateOTP, verifyOTP, resetSession, resetPassword, profileSettings } = require("../controllers/userAuth")
const localVariables = require("../middlewares/middleware")
const { isTokenValid } = require("../utils/index")
const router = express.Router()

// POST METHODS
router.post("/signup", createAccount)
router.post("/login", login)
router.post("/generateOTP", localVariables, generateOTP) //generate randome OTP

// GET METHODS
router.get("/logout", logout)
router.get("/verifyOTP", verifyOTP)  //verify generated OTP
// router.get("/createResetSession", createResetSession)  //reset all variables

// UPDATE METHODS
router.post("/resetSession", resetSession) //reset session to validate email or send reset email link
router.put("/password-reset/:userId/:token", resetPassword) //reset password to update user credentials
router.put("/profileSettings/:id", profileSettings) // update user profile


module.exports = router 