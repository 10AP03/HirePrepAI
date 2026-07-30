import CandidateSkillProfile from "../models/CandidateSkillProfile.js";

export const createOrUpdateSkillProfile = async (candidateId,extractedSkills) => 
{
  try
  {
    let skillProfile = await CandidateSkillProfile.findOne({candidate: candidateId,}); // Check whether the candidate has a skill profile

    const formattedSkills = extractedSkills.map((skill) => ({
      skillName: skill,
      confidence: 0,
      strengths: [],
      weaknesses: [],
      }));

      if (skillProfile)
      {
        skillProfile.skills = formattedSkills;

        await skillProfile.save();
        return skillProfile;
      }

      skillProfile = await CandidateSkillProfile.create({candidate: candidateId,skills: formattedSkills,});
      return skillProfile;
  }
  catch (error)
  {
    console.error("Create Skill Profile Error:",error.message);
    throw error;
  }
};

export const updateSkillConfidence = async (candidateId, interview) => 
{
  try
  {
    let skillProfile = await CandidateSkillProfile.findOne({ candidate: candidateId });

    if (!skillProfile)
    {
      skillProfile = await CandidateSkillProfile.create({
        candidate: candidateId,
        skills: []
      });
    }

    let skill = skillProfile.skills.find(
      (s) => s.skillName.toLowerCase() === interview.subject.toLowerCase()
    );

    if (!skill)
    {
      skill = {
        skillName: interview.subject,
        confidence: 0,
        strengths: [],
        weaknesses: []
      };
      skillProfile.skills.push(skill);
      skill = skillProfile.skills[skillProfile.skills.length - 1];
    }

    skill.confidence = Math.min(100, Math.round(interview.overallScore * 10));

    skill.strengths = [];
    skill.weaknesses = [];

    interview.questions.forEach((question) =>
    {
      if (question.score >= 7)
      {
        skill.strengths.push(question.feedback);
      }
      else
      {
        skill.weaknesses.push(question.feedback);
      }
    });

    await skillProfile.save();
    return skillProfile;
  }
  catch (error)
  {
    console.error("Update Skill Confidence Error:", error.message);
    throw error;
  }
};