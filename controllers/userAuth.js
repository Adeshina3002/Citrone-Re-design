const User = require("../models/usersModel")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError,ServerError,UnauthenticatedError,NotFoundError } = require("../errorHandler")
const { attachCookiesToResponse, createUserPayload } = require("../utils")


const createAccount = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, track } = req.body

        if (!firstName || !lastName || !email || !password || !track) {
            return next (new BadRequestError("All fields are mandatory"))
        }

        const userExist = await User.findOne({ email }) 

        if (userExist) {
            return next(new BadRequestError("Email already exists"))
        }

        const user = await User.create(req.body)
        res.status(StatusCodes.CREATED).json({ user })

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error: error.message})
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body 

        if (!email || !password) {
            throw new BadRequestError ("Provide a valid email and password") 
        }

        const user = await User.findOne({ email })

        if (!user) {
            return next (new UnauthenticatedError("Invalid credentials! Provide a valid email"))
        }

        const confirmPassword = await user.comparePassword(password)

        if (!confirmPassword) {
            return next (new UnauthenticatedError("Invalid Password, please try again"))
        }

        const userPayload = createUserPayload(user)
        
        const token = attachCookiesToResponse ({ res, user: userPayload })

        res.status(StatusCodes.OK).json({token, user: userPayload})
        // res.status(StatusCodes.OK).json({token})

    } catch (error) {
        return new ServerError("Error reading from the server")
    }
}

const logout = async (req, res) => {
    try {
        res.cookie('token', 'logout', {
            httpOnly: true,
            expires: new Date(Date.now() + 1000)
        })
        res.status(StatusCodes.OK).json({ message: "User logged out"})
    } catch (error) {
        return new ServerError("Error reading from the server")
    }
}


module.exports = {
    createAccount, 
    login, 
    logout
}