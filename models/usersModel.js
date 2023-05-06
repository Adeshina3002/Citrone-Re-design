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
    newPassword: {
        type: String,
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(v) {
                return v === (this.password || this.confirmPassword)
            },
            message: "Password do not match"
        }
    },
    track: {
        type: String,
        enum: [
            "UI/UX",
            "Frontend Development",
            "Backend Development",
            "Data Science",
            "Mobile Development",
            "Software Testing",
            "Blockchain",
            "DevOps",
          ],
    },
    country: {
        type: String,
    },
    city: {
        type: String
    },
    bio: {
        type: String,
    },
    bgImage: {
        type: String
    },
    profilePicture: {
        type: String
    },
    roles: {
        type: String,
        enum: ["Student", "Admin", "Tutor"],
        default: "Student"
    }
},
    {timestamps: true}
)

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(userPassword) {
    const isMatch = await bcrypt.compare(userPassword, this.password )
    return isMatch
}

module.exports = mongoose.model("User", userSchema)
