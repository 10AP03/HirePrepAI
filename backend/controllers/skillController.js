import CandidateSkillProfile from "../models/CandidateSkillProfile.js";

export const getSkillProfile = async (req, res) => {
  try
  {
    const skillProfile = await CandidateSkillProfile.findOne({candidate: req.user._id,});

    if (!skillProfile)
    {
      return res.status(404).json({success: false,message: "Skill profile not found.",});
    }
    return res.status(200).json({success: true,message: "Skill profile fetched successfully.",skillProfile,});
  }
  catch (error)
  {
    console.error("Get Skill Profile Error:",error.message);
    return res.status(500).json({success: false,message: "Internal Server Error.",});
  }
};