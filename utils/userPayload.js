const createUserPayload = (user) => {
    return {
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        track: user.track
    }
}

module.exports = createUserPayload 