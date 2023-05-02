const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    track: {
      type: String,
      enum: [
        "UI/UX",
        "Front Development",
        "Backend Development",
        "Data Science",
        "Mobile Development",
        "Software Testing",
        "Blockchain",
        "DevOps",
      ],
      required: true,
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    level: {
      type: String,
      enum: ["Beginner Level", "Intermediate Level"],
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Course", courseSchema)