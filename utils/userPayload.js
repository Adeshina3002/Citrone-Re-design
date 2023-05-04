const createUserPayload = (user) => {
    return {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        track: user.track,
        roles: user.roles
    }
}

module.exports = createUserPayload 