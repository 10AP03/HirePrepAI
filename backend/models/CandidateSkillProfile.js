import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    skillName:
    {
      type: String,
      required: true,
      trim: true,
    },
    confidence:
    {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    strengths:
    {
      type: [String],
      default: [],
    },
    weaknesses:
    {
      type: [String],
      default: [],
    },
  },{ _id: false }                      // We don't need a separate ObjectId for every skill.
);

const candidateSkillProfileSchema = new mongoose.Schema(      // one profile per candidate
  {
    candidate:
    {
      type: mongoose.Schema.Types.ObjectId,ref: "User",
      required: true,
      unique: true, 
    },
    skills:
    {
      type: [skillSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CandidateSkillProfile = mongoose.model("CandidateSkillProfile",candidateSkillProfileSchema);

export default CandidateSkillProfile;