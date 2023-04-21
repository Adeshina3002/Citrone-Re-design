const express = require("express")
const router = express.Router()
const { isTokenValid } = require("../utils")
const { sendMessage, allMessages } = require("../controllers/messageController")

router.route("/").post(isTokenValid, sendMessage)
router.route("/:chatId").get(isTokenValid, allMessages)

module.exports = router

