const User = require("../models/usersModel")
const { BadRequestError,ServerError,UnauthenticatedError,NotFoundError } = require("../errorHandler")
const Chat = require("../models/chatModel")
const Message = require("../models/messageModel")
const { StatusCodes } = require("http-status-codes")

const accessChat = async (req, res) => {
    try {
        const { userId } = req.body
        
        if (!userId || userId.length === 0) {
            throw new BadRequestError("User id parameter not sent with request")
        }

        /* checking if there is an established one-on-one chat between the 2 users and also return all the query from the users schema except the password firstname and lastname */

        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user.userId}}},
                { users: { $elemMatch: { $eq: userId }}}
            ],
        }).populate({
            path: 'users',
            select: '-password -firstName -lastName' 
          }).populate("latestMessage")
        
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "fullName email"
        })

        if (isChat.length >= 1) {
            return res.send(isChat[0])

        } else {
            // else create one-on-one chat between the 2 users
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user.userId, userId ]
            }
            const createdChat = await Chat.create(chatData)

            // fetching all the chat between the 2 users
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate({
                path: 'users',
                select: '-password -firstName -lastName'
              })

            res.status(StatusCodes.OK).send(fullChat)
        }
    } catch (error) {
        // throw new BadRequestError("Bad request")
        res.status(400).send(error.message)
    }
}

const fetchChat = async (req, res) =>{
    try {
        // check which user is logged-in and query the chats without the password firstName lastName 
        const results = await Chat.find({ users: {$elemMatch: { $eq: req.user.userId }}})
        .populate("latestMessage")
            .sort({ updatedAt: -1 })
        .populate({
            path: 'users',
            select: '-password -firstName -lastName'
          })
        .populate("groupAdmin", "-password")
        
            // .then(async (results) => {
            //     results = await User.populate(results, {
            //         path: "latestMessage.sender",
            //         select: "fullName email"
            //     })
            //     return results
            // })

            const populatedResults = await User.populate(results, {
                        path: "latestMessage.sender",
                        select: "fullName email"
                    })

        res.status(StatusCodes.OK).send(populatedResults)

    } catch (error) {
        throw new BadRequestError(error.message)
    }
}

const createGroupChat = async (req, res) => {
    try {
        // check if the users and name parameters are passed in the request body
        if (!req.body.users || !req.body.chatName) {
            throw new BadRequestError("All fields are mandatory")
        }

            // parsing the request body from the client to a JSON data
        let users = JSON.parse(req.body.users)
        // console.log("first log of users", users);

        // making sure the groupm chat is existing between more than 2 users
        if (users.length < 2) {
            throw new BadRequestError("You need more than 2 users to form a group")
        }

        // include the current logged-in user to the group chat
        users.push(req.user.userId)
        // console.log("second log of users",users);

        const groupChat = await Chat.create({
            chatName: req.body.chatName,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.userId
        })

        // query the chat specific to only the group without parsing the password firstname and lastname from users schema
        const fullGroupChat = await Chat.findOne({ _id:groupChat._id })
        .populate({
            path: 'users',
            select: '-password -firstName -lastName'
          })
          .populate({
            path: 'groupAdmin',
            select: '-password -firstName -lastName'
          })

            res.status(StatusCodes.OK).send(fullGroupChat)
    } catch (error) {
        throw new BadRequestError(error.message)
    }
}

const renameGroup = async (req, res) => {
    try {
        // parse the chatId and chatName in the request body
        const { chatId, chatName } = req.body 

        // find the chat using chatId and update the group name and query the result without the firstname, lastname and password
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            chatName
        },
        {
            new: true  // accept the new modified chat name to the database
        })
        .populate({
            path: 'users',
            select: '-password -firstName -lastName'
          })
          .populate({
            path: 'groupAdmin',
            select: '-password -firstName -lastName'
          })

        if (!updatedChat) {
            throw new NotFoundError("No chat found")
        } 

        res.status(StatusCodes.OK).json(updatedChat)

    } catch (error) {
        throw new BadRequestError(error.message)
    }
}

const addToGroup = async (req, res) => {
    try {
        // parse the chatId and chatName in the request body
        const { chatId, userId } = req.body 

        // checking if the userId is a member of the group
        const existingMember = await Chat.findOne({ _id: chatId, users: userId });

        if (existingMember) {
        // throw new BadRequestError("User already exists in the group");
        return res.status(StatusCodes.BAD_REQUEST).json({message: "User already exists in the group"})
    }

    // if the userId is not a memeber, proceed to add the userId to the group, query the result without the firstname, lastname and password
        const newMember = await Chat.findByIdAndUpdate(chatId, {
            $push: { users: userId }
        },
        { 
            new: true // accept the modification to the database
        })
        .populate({
            path: 'users',
            select: '-password -firstName -lastName'
          })
          .populate({
            path: 'groupAdmin',
            select: '-password -firstName -lastName'
          })

        if (!newMember) {
            // throw new NotFoundError("Chat not found")
            return res.status(StatusCodes.NOT_FOUND).json({message: "Chat not found"})
        }

        res.status(StatusCodes.OK).json(newMember)

    } catch (error) {
        throw new BadRequestError(error.message)  
    }
}

const removeFromGroup = async(req, res) => {
    try {
        // parse the chatId and chatName in the request body
        const { chatId, userId } = req.body 

        const removedMember = await Chat.findByIdAndRemove(chatId, {
            $push: { users: userId }
        },
        { 
            new: true 
        })
        .populate({
            path: 'users',
            select: '-password -firstName -lastName'
          })
          .populate({
            path: 'groupAdmin',
            select: '-password -firstName -lastName'
          })

        if (!removedMember) {
            // throw new NotFoundError("Chat not found")
            return res.status(StatusCodes.NOT_FOUND).json({message: "Chat not found"}) 
        }

        res.status(StatusCodes.OK).json({message: "User removed from group",removedMember})

    } catch (error) {
        throw new BadRequestError(error.message)
    }
}


module.exports = {
    accessChat,
    fetchChat,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
}