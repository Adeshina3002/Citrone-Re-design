const CustomError = require("./customError")
const {StatusCodes} = require("http-status-codes")

class UnauthenticatedError extends CustomError {
    constructor (message) {
        super (messsage);
        this.StatusCodes = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthenticatedError 