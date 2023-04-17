const express = require("express")
const { createAccount, login, logout } = require("../controllers/userAuth")
const router = express.Router()


router.post("/signup", createAccount)
router.post("/login", login)
router.get("/logout", logout)


module.exports = router 