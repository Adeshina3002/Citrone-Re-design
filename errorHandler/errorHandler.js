const {StatusCodes} = require("http-status-codes")


const errorHandler = (err, req, res, next) => {
    const statusCode = StatusCodes ? StatusCodes : StatusCodes.INTERNAL_SERVER_ERROR
    
    switch (statusCode) {
        case StatusCodes.NOT_FOUND:
            res.json({ 
                title: "Not Found",
                message : err.message, 
                stackTrace: err.stack })
            break;

        case StatusCodes.BAD_REQUEST:
            res.json({ 
                title: "Validation Failed",
                message : err.message, 
                stackTrace: err.stack })
            break;

        case StatusCodes.UNAUTHORIZED:
            res.json({ 
                title: "Un-authorised",
                message : err.message, 
                stackTrace: err.stack })
            break;

        case StatusCodes.FORBIDDEN:
            res.json({ 
                title: "Forbidden",
                message : err.message, 
                stackTrace: err.stack})
            break;   
            
        case StatusCodes.INTERNAL_SERVER_ERROR:
            res.json({ 
                title: "Server Error",
                message : err.message, 
                stackTrace: err.stack })
            break; 

        default:
            console.log("Possible routes error");
            // res.json({ 
            //     title: "Invalid Routes",
            //     message : err.message, 
            //     stackTrace: err.stack })
            break;
    }
    
}

module.exports = errorHandler