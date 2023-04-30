const Message = require("../models/messageModel")
const Chat = require("../models/chatModel")
const User = require("../models/usersModel")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError,ServerError,UnauthenticatedError,NotFoundError } = require("../errorHandler")

const sendMessage = async (req, res) => {
    try {
        // parse the chatId and content in the request body
        const { chatId, content } = req.body

        // if no chatId or content is passed in the request body
        if (!chatId || !content) {
            return new BadRequestError("Invalid data passed to the request")
        }

        const newMessage = {
            sender: req.user.userId,
            content: content,
            chatId: chatId 
        }

        let message = await Message.create(newMessage)

        message = await message.populate([
            { path: "sender", select: "fullName email" },
            { path: "chat" }
        ])

        message = await User.populate(message, {
            path: "chat.users",
            select: "fullName email"
        })

        await Chat.findByIdAndUpdate({_id: req.body.chatId}, {
            latestMessage: message
        }) 
        
        res.status(StatusCodes.CREATED).json(message)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
    }
}

const allMessages = async (req, res) => {
    try {
        const { chatId } = req.params.chatId

        const messages = await Message.find({chat: chatId})
        .populate("sender", "fullName email")
        .populate("chat")

        res.status(StatusCodes.OK).send(messages)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
    }
}

const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;

        // find the message by id and ensure that the user has permission to delete it
        const message = await Message.findOne({_id: messageId, sender: req.user.userId});
        if (!message) {
            throw new NotFoundError("Message not found");
        }

        // delete the message
        await message.delete();

        res.status(StatusCodes.OK).json({message: "Message deleted successfully"});
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message);
    }
}

module.exports = {
    sendMessage,
    allMessages,
    deleteMessage
}