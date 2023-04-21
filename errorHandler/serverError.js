const CustomError = require("./customError")
const {StatusCodes} = require("http-status-codes")

class ServerError extends CustomError {
    constructor (message) {
        super (message)
        this.StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
    }
}

module.exports = ServerError 