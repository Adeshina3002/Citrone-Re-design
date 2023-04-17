const mongoose = require("mongoose")

const moduleSchema = mongoose.Schema({
    module: {
        name: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },

    lessons: [{
        name: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        fileURL: {
            type: String,
            required: true
        }
    }],
    liveClassURL: {
        type: String,
        required: true
    },
    recordedClassURL: {
        type: String,
        required: true
    }
},
    {timestamps: true}
)

module.exports = mongoose.model("Module", moduleSchema)