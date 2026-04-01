const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["resume", "jobmatch", "skillgap", "interview"],
      required: true,
    },
    input: {
      resumeText: String,
      jobDescription: String,
      targetRole: String,
      skills: String,
      experienceLevel: String,
    },
    result: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);