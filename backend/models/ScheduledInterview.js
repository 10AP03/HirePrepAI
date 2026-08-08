import mongoose from "mongoose";

const scheduledInterviewSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewType: { type: String, required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    targetRole: { type: String, required: true },
    difficulty: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true, default: 5 },
    status: {
      type: String,
      enum: ["Open", "Claimed"],
      default: "Open",
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: null,
    },
  },
  { timestamps: true }
);

const ScheduledInterview = mongoose.model("ScheduledInterview", scheduledInterviewSchema);

export default ScheduledInterview;