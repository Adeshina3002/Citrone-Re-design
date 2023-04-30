const express = require("express")
const router = express.Router()
const { isTokenValid } = require("../utils")
const { sendMessage, allMessages, deleteMessage } = require("../controllers/messageController")

router.route("/").post(isTokenValid, sendMessage)
router.route("/:chatId").get(isTokenValid, allMessages)
router.route("/:messageId").delete(isTokenValid, deleteMessage)

module.exports = router

