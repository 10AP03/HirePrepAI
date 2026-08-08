import User from "../models/User.js";
import Resume from "../models/Resume.js";
import Interview from "../models/Interview.js";
import ScheduledInterview from "../models/ScheduledInterview.js";


export const getAllCandidates = async (req, res) => {
  try 
  {
    const candidates = await User.find({role: "candidate",}).select("name email createdAt").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Candidates fetched successfully.",
      count: candidates.length,
      candidates,
    });

  } 
  catch (error) 
  {
    console.error("Get all candidates failed:",error.message);
    return res.status(500).json({success: false,message: "Failed to fetch candidates.",});
  }
};

export const getCandidateProfile = async (req, res) => {
  try 
  {
    const { candidateId } = req.params;

    const candidate = await User.findOne({_id: candidateId,role: "candidate",}).select("name email createdAt");

    if (!candidate) 
    {
      return res.status(404).json({success: false,message: "Candidate not found.",});
    }

    const resume = await Resume.findOne({user: candidateId,}).select("resumeFile fileName extractedSkills atsScore aiFeedback status createdAt");

    return res.status(200).json({
      success: true,
      message: "Candidate profile fetched successfully.",
      candidate,
      resume,
    });

  } 
  catch (error) 
  {
    console.error("Get candidate profile failed:",error.message);
    return res.status(500).json({success: false,message: "Failed to fetch candidate profile.",});
  }
};

export const getCandidateInterviewHistory = async (req, res) => {
  try 
  {
    const { candidateId } = req.params;

    const candidate = await User.findOne({_id: candidateId,role: "candidate",}).select("_id");

    if (!candidate) 
    {
      return res.status(404).json({success: false,message: "Candidate not found.",});
    }

    const interviews = await Interview.find({candidate: candidateId,}).select("interviewType subject topic targetRole difficulty numberOfQuestions status overallScore createdAt").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Candidate interview history fetched successfully.",
      count: interviews.length,
      interviews,
    });

  } 
  catch (error) 
  {
    console.error("Get candidate interview history failed:",error.message);
    return res.status(500).json({success: false,message: "Failed to fetch candidate interview history.",});
  }
};

export const getCandidateInterviewReport = async (req, res) => {
  try 
  {
    const { candidateId, interviewId } = req.params;

    const candidate = await User.findOne({_id: candidateId,role: "candidate",}).select("_id");

    if (!candidate) 
    {
      return res.status(404).json({success: false,message: "Candidate not found.",});
    }

    const interview = await Interview.findOne({_id: interviewId,candidate: candidateId,});

    if (!interview) 
    {
      return res.status(404).json({success: false,message: "Interview not found for this candidate.",});
    }

    return res.status(200).json({success: true,message: "Candidate interview report fetched successfully.",interview,});

  } 
  catch (error) 
  {
    console.error("Get candidate interview report failed:",error.message);
    return res.status(500).json({success: false,message: "Failed to fetch candidate interview report.",});
  }
};

export const getRecruiterAnalytics = async (req, res) => {
  try 
  {
    const totalCandidates = await User.countDocuments({role: "candidate",});      // Candidate count must come from the User collection.

    const interviews = await Interview.find();                             // Recruiter analytics represents platform-wide interview data.

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter((interview) => interview.status === "Completed"); 

    const completedInterviewsCount = completedInterviews.length;

    const totalScore = completedInterviews.reduce((sum, interview) => sum + interview.overallScore,0);

    const averageScore = completedInterviewsCount > 0 ? totalScore / completedInterviewsCount: 0;

    const candidatePerformance = {};

    completedInterviews.forEach((interview) => {
    const candidateId = interview.candidate.toString();

    if (!candidatePerformance[candidateId]) 
    {
      candidatePerformance[candidateId] = 
      {
        totalScore: 0,
        completedInterviews: 0,
      };
    }
    candidatePerformance[candidateId].totalScore +=interview.overallScore;
    candidatePerformance[candidateId].completedInterviews += 1;
    });

    const candidateScores = Object.entries(candidatePerformance).map(([candidateId, performance]) => ({
      candidateId,
      averageScore:performance.totalScore /performance.completedInterviews,
      completedInterviews:performance.completedInterviews,}));

    const topCandidateScores = candidateScores.sort((a, b) => b.averageScore - a.averageScore).slice(0, 5); // Only the top 5 candidates  are required for recruiter analytics.

    const topCandidateIds = topCandidateScores.map((candidate) => candidate.candidateId);

    const candidates = await User.find({_id: { $in: topCandidateIds },role: "candidate",}).select("name email");

    const topPerformingCandidates = topCandidateScores.map((candidateScore) => {
                
    const candidate = candidates.find((user) =>user._id.toString() ===candidateScore.candidateId);
            
    if (!candidate) 
    {
      return null;
    }
    return {
      candidateId: candidate._id,
      name: candidate.name,
      email: candidate.email,
      averageScore: Number(candidateScore.averageScore.toFixed(2)),
      completedInterviews:candidateScore.completedInterviews,
    };
    }).filter(Boolean);

    return res.status(200).json({success: true,message: "Recruiter analytics fetched successfully.",
    analytics: {
      totalCandidates,
      totalInterviews,
      completedInterviews: completedInterviewsCount,
      averageScore: Number(averageScore.toFixed(2)),
      topPerformingCandidates,
    },
    });
  } 
  catch (error) 
  {
    console.error("Recruiter Analytics Error:", error);
    return res.status(500).json({success: false,message: "Failed to fetch recruiter analytics.",error: error.message,});
  }
};

export const createScheduledInterview = async (req, res) => {
  try
  {
    const { interviewType, subject, topic, targetRole, difficulty, numberOfQuestions } = req.body;

    if (!interviewType || !subject || !topic || !targetRole || !difficulty)
    {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields."
      });
    }

    const scheduledInterview = await ScheduledInterview.create({
      recruiter: req.user._id,
      interviewType,
      subject,
      topic,
      targetRole,
      difficulty,
      numberOfQuestions: numberOfQuestions || 5,
    });

    return res.status(201).json({
      success: true,
      message: "Interview scheduled successfully.",
      scheduledInterview
    });
  }
  catch (error)
  {
    console.error("Create scheduled interview failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to schedule interview."
    });
  }
};

export const getMyScheduledInterviews = async (req, res) => {
  try
  {
    const scheduledInterviews = await ScheduledInterview.find({ recruiter: req.user._id })
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Scheduled interviews fetched successfully.",
      scheduledInterviews
    });
  }
  catch (error)
  {
    console.error("Get scheduled interviews failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch scheduled interviews."
    });
  }
};