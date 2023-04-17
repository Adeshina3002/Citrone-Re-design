const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide your firstName"]
    },
    lastName: {
        type: String,
        required: [true, "Please provide your lastName"]
    },
    fullName: {
        type: String,
        required: true,
        default: function () {
            return `${this.firstName} ${this.lastName}`
        }
    },
    email: {
        type: String,
        required: [true, "Provide your email address"],
        unique: [true, "Provide a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please provide your password"]
    },
    track: {
        type: String,
        enum: ["UI/UX", "Frontend", "Backend", "Data Science"],
        required: [true, "Select your track"]
    },
    role: {
        type: String,
        enum: ["user", "admin", "tutor"],
        default: "user"
}},
    {timestamps: true}
)

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password)
    return isMatch
}

module.exports = mongoose.model("User", userSchema)
