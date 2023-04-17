const CustomError = require("./customError")
const {StatusCodes} = require("http-status-codes")

class BadRequestError extends CustomError {
    constructor (message) {
        super(message);
        this.StatusCodes = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestError