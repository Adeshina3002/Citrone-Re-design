const BadRequestError = require("./badRequest")
const CustomError = require("./customError")
const ServerError = require("./serverError")
const UnauthenticatedError = require("./unauthError")
const NotFoundError = require("./notFound")

module.exports = {
    BadRequestError,
    ServerError,
    UnauthenticatedError,
    NotFoundError
}