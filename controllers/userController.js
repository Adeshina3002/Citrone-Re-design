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

const searchUser = async (req, res) => {
  try {
    const keyword = req.query.search;

    // if (!keyword) {
    //   throw new BadRequestError("Please provide a keyword for search")
    // }

    const query = keyword
    
      ? {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
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
  searchUser,
  currentUser
}