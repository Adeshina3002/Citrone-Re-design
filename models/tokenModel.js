const mongoose = require("mongoose")

const tokenSchema = mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 60 * 10
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("Token", tokenSchema)