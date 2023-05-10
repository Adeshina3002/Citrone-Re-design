const jwt = require("jsonwebtoken")

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_LIFETIME
    })
    return token
}

// const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET)


const isTokenValid = async (req, res, next) => {
    // try {
    //     let token;
    //     let authHeader = req.headers.Authorization || req.headers.authorization 
    //     if(authHeader && authHeader.startsWith("Bearer")) {
    //         token = authHeader.split(" ")[1]
    //         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //             if (err) {
    //                 res.status(401);
    //                 throw new Error ("User is not authorized")
    //             }
    //             req.user = decoded.user;
    //             next();
    //         });
    //         if (!token) {
    //             res.status(401)
    //             throw new Error("user is not authorized or token missing in the request")
    //         }
    //     }
    // } catch (error) {
    //     res.status(500).send(error.message)
    // }

    try {
        // access auth header to validate token
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer")) {
          throw new Error("Invalid authorization header");
        }
        const token = authHeader.split(" ")[1];

        // retrieve user details from the logged-in user
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded token: ", decodedToken);
        req.user = {
            userId: decodedToken.userId,
            fullName: decodedToken.fullName,
            track: decodedToken.track,
            email: decodedToken.email,
            roles: decodedToken.roles 
        };
     
        next();
      } catch (error) {
        console.error(error);
        res.status(401).send("Authentication failed...");
      }
}

const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({ payload: user})
    const oneDay = 1000 * 60 * 60 * 24
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date( Date.now() + oneDay ),
        signed: true,
    })
    return token 
}

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse
}
