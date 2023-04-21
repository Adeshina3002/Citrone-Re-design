const User = require("../models/usersModel") 
const {StatusCodes} = require("http-status-codes")
const { BadRequestError,ServerError,UnauthenticatedError,NotFoundError } = require("../errorHandler")

const allUser = async (req, res) => {
  try {

    const users = await User.find().sort("name");

    if (!users || users.length === 0) {
      throw new NotFoundError("No registered users at this moment")
      // return res.status(StatusCodes.NOT_FOUND).json({message: "No registered users at this moment"})
    }
    res.status(StatusCodes.OK).json(users);

  } catch (error) {
    // throw new ServerError("Error reading from the server")
    return res.status(StatusCodes.BAD_REQUEST).json({error: error.message})
  
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params

    if (!email )  {
      return res.status(StatusCodes.BAD_REQUEST).json({message: "Invalid email"})
    }
    const user = await User.findOne({ email })

    // remove password from the user data
    const {password, ...rest} = Object.assign({}, user.toJSON()) // converting the return data from the mongoose to JSON

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({message: `User with ${email} not found`})
    }

    res.status(StatusCodes.OK).json(rest)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message)
  }
}

const updateUser = async(req, res) => {
  try {

    const { userId } = req.user 

    if (!userId) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Please log in your credentials"})
    }

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    } 

    const updatedData = await User.updateOne({_id: userId}, data)

    res.status(StatusCodes.OK).json({message: "Record updated..."})

  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json("Un authorized user")
  }
}

const searchUser = async (req, res) => {
  try {
    const keyword = req.query.search;

    // if (!keyword) {
    //   throw new BadRequestError("Please provide a keyword for search")
    // }

    const query = keyword
    
      ? {
          $or: [
            { firstName: { $regex: keyword, $options: "i" } },
            { lastName: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
          ],
          _id: { $ne: req.user._id },
        }
      : {};

    const user = await User.findOne(query);

    if (!user || user.length === 0) {
      throw new NotFoundError("User doesn't exist")
      // return res.status(StatusCodes.NOT_FOUND).json({message: "User doesn't exist"})
    }

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
  //  return new ServerError("Server Error")
  res.status(StatusCodes.BAD_REQUEST).json({error: error.message})
  }
}

const currentUser =  async(req, res) => {
  res.json(req.user)
}

module.exports = { 
  allUser,
  getUser,
  searchUser,
  currentUser,
  updateUser
}