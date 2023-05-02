const express = require("express")
const { createChat, fetchChat, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatControllers")
const {isTokenValid} = require("../utils")
const router = express.Router()

router.route('/').post(isTokenValid, createChat)
router.route('/').get(isTokenValid, fetchChat)
router.route('/group').post(isTokenValid, createGroupChat)
router.route('/rename').put(isTokenValid, renameGroup)
router.route('/groupRemove').post(isTokenValid, removeFromGroup)
router.route('/groupAdd').put(isTokenValid, addToGroup)


module.exports = router 