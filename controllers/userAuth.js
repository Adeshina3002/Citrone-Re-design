const User = require("../models/usersModel")
const { StatusCodes } = require("http-status-codes")
// const { BadRequestError,ServerError,UnauthenticatedError,NotFoundError } = require("../errorHandler")
const { attachCookiesToResponse, createUserPayload } = require("../utils")
const OTPGenerator = require("otp-generator")
const Token = require("../models/tokenModel")
const crypto = require("crypto")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const sendMail = require("../utils/nodeMailer")


const createAccount = async (req, res) => {
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            track,
            country,
            city,
            bio,
            bgImage,
            profilePicture } = req.body

        if (!firstName || !lastName || !email || !password) {
            // return next (new BadRequestError("All fields are mandatory"))
            return res.status(StatusCodes.BAD_REQUEST).json({message: "All fields are mandatory"})
        }

        const userExist = await User.findOne({ email }) 

        if (userExist) {
            // return next(new BadRequestError("User already exists"))
            return res.status(StatusCodes.BAD_REQUEST).json({message: "User already exists"})
        }

        const user = await User.create(req.body)

        // generateOTP()

        res.status(StatusCodes.CREATED).json({ status: "User created successfully", user })

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({error: error.message})
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body 

        if (!email || !password) {
            // throw new BadRequestError ("Provide a valid email and password")
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Provide a valid email and password"})
        }

        const user = await User.findOne({ email })

        if (!user) {
            // return next (new UnauthenticatedError("User not found..."))
            return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"})
        }

        const confirmPassword = await user.comparePassword(password)

        if (!confirmPassword) {
            // return next (new UnauthenticatedError("Invalid Password, please try again"))
            return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid Password, please try again"})
        }

        const userPayload = createUserPayload(user)
        
        const token = attachCookiesToResponse ({ res, user: userPayload })

        res.status(StatusCodes.OK).json({ message: "Login successful...", token, user: userPayload})
        // res.status(StatusCodes.OK).json({token})

    } catch (error) {
        // return new ServerError("Error reading from the server")
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
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
        // return new ServerError("Error reading from the server")
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Error reading from the server"})
    }
}

const generateOTP = async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found" });
        }

        const OTP = OTPGenerator.generate(5, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        req.app.locals.OTP = OTP;

        const link = `Dear ${user.fullName},

            Use this One time Password to verify your identity.
            
            OTP CODE: ${OTP}.
            
            This code expires in 10 minutes`;

        await sendMail(user.email, "OTP LINK", link);
        res.status(StatusCodes.OK).json({ message: "OTP code has been sent to your email and expires in 10 minutes." });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    
}

const verifyOTP = (req, res) => {
    const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; //reset OTP value
        req.app.locals.resetSession = true // start session for reset password

        return res.status(StatusCodes.CREATED).json({message: "verification successful..."})
    }

    return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid OTP"})
}

const resetSession = async(req, res) => {
    try {
        const email = req.body 

        const JoiSchema = Joi.object({
            email: Joi.string().email().required()
        })
        const { error } = JoiSchema.validate(email)

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message)
        }

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "User not found"})
        }

        // let token = await Token.findOne({ userId: user._id })
        
        // if (!token) {
        //     token = await new Token({
        //         userId: user._id,
        //         token: crypto.randomeBytes(32).toString("hex")
        //     }).save()
        // }

        let token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex")
                }).save()

        const link = `Dear ${user.fullName},

        You recently requested to reset your password.
        
        Please click on the link below to reset your password;

        ${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`

        await sendMail(user.email, "RESET PASSWORD", link)
        res.status(StatusCodes.OK).json({message: "Password reset link has been sent to your inbox and expires in 10 minutes. You can check your spam folder"})

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
    }
}

const resetPassword = async(req, res) => {
    try {
        Joi.password = () => Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))

        const JoiSchema =Joi.object({
            password: Joi.password().required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        }).with('password', 'confirmPassword')

        const { error } = JoiSchema.validate(req.body)

        if (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message)
        }

        const user = await User.findById( req.params.userId )

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "User not found"})
        }        

        const token = await new Token({
            userId: user._id,
            token: req.params.token 
        })

        if (!token) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "The link is Invalid or has expired"})
        }
        // hashing the new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const updateData = {
            password: hashedPassword,
            confirmPassword: hashedPassword
        }

        await User.updateOne({_id: user._id}, updateData)

        if (token.delete) {
            await token.delete();
        }

        res.status(StatusCodes.OK).json({message: "Password reset successful. Please log in with your new password"})

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({message: error.message})
    }
}

const profileSettings = async(req, res) => {
    try {
        // validating user existence
        const user = await User.findById(req.params.id)

        if (!user) {
            res.status(StatusCodes.BAD_REQUEST).json("User does not exist")
        }

        // updating the user data
        const updateUser = await User.findByIdAndUpdate(req.params.id, req.body,{
            fields: {password: 0, confirmPassword: 0}, 
            new: true,
        });
        res
            .status(StatusCodes.OK)
            .json({message: "user successfully updated", updateUser})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json(error.message)
    }
}




module.exports = {
    createAccount, 
    login, 
    logout,
    generateOTP, 
    verifyOTP,
    resetSession,
    resetPassword, 
    profileSettings
}