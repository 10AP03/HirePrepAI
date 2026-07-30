import Interview from "../models/Interview.js";
import { generateInterviewQuestion, evaluateInterviewAnswer, generateFinalInterviewFeedback } from "../services/interviewAIService.js";
import { updateSkillConfidence } from "../services/skillService.js";

export const startInterview = async (req, res) => {           //new AI interview session.
  try 
  {
    const                                                   // interview configuration
    {
      interviewType,
      subject,
      topic,
      targetRole,
      difficulty,
      numberOfQuestions,
    } = req.body;

    if (!interviewType ||!subject ||!topic ||!targetRole ||!difficulty ||!numberOfQuestions)  // Validation of interview terms
    {
      return res.status(400).json({
      success: false,
      message: "All interview fields are required.",
      });
    }    
    const interview = await Interview.create({              // Create the interview session first.
      candidate: req.user._id,
      interviewType,
      subject,
      topic,
      targetRole,
      difficulty,
      numberOfQuestions,
      questions: [],
      status: "In Progress",
    });
    const generatedQuestion = await generateInterviewQuestion({         // Generate the first interview question
      interviewType,
      subject,
      topic,
      targetRole,
      difficulty,
      previousQuestions: [],
    });
        
    interview.questions.push({                          // push the interview questions in the interview document
      question: generatedQuestion.question,
      answer: "",
      score: null,
      feedback: "",
    });
        
    await interview.save();                     // Save the updated Interview document in MongoDB
    res.status(201).json({                  // Return the interview ID and first question to the candidate
      success: true,
      message: "Interview started successfully.",
      interview: 
      {
        interviewId: interview._id,
        status: interview.status,
        currentQuestion: generatedQuestion.question,
        questionNumber: 1,
        totalQuestions: interview.numberOfQuestions,
      },
    });
  } 
  catch (error) 
  {
    console.error("Start Interview Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const submitInterviewAnswer = async (req, res) => {
  try 
  {
    const { interviewId } = req.params;        // Get interview ID from URL parameters

    const { answer } = req.body;          // Get candidate answer from request body

    if (!answer || !answer.trim())         // Validate candidate answer 
    {
      return res.status(400).json({
      success: false,
      message: "Answer is required."
      });
    }
        
    const interview = await Interview.findById(interviewId);      // Find the specific interview session
    
    if (!interview) 
    {
      return res.status(404).json({
      success: false,
      message: "Interview not found."
      });
    }
        
    if (!interview.candidate.equals(req.user._id))      // Verify that the logged-in candidate owns this interview 
    {
      return res.status(403).json({
      success: false,
      message: "You are not authorized to access this interview."
      });
    }
      
    if (interview.status !== "In Progress")               
    {
      return res.status(400).json({
      success: false,
      message: "This interview is not currently in progress."
      });
    }

    const currentQuestion = interview.questions.find((question) => question.answer === "");   // Find the current unanswered question

    if (!currentQuestion) 
    {
      return res.status(400).json({
      success: false,
      message: "No unanswered question found."
      });
    }

    currentQuestion.answer = answer.trim();           // Store candidate answer in the current question

    const evaluation = await evaluateInterviewAnswer({        // Send interview context and answer to AI for evaluation
      interviewType: interview.interviewType,
      subject: interview.subject,
      topic: interview.topic,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      question: currentQuestion.question,
      candidateAnswer: currentQuestion.answer
    });

      currentQuestion.score = evaluation.score;             // Store AI evaluation in the same embedded question
      currentQuestion.feedback = evaluation.feedback;
      
    if (interview.questions.length < interview.numberOfQuestions)     // Check whether more questions are required
    {
 
      const previousQuestions = interview.questions.map((question) => question.question);   // Extract all previously asked questions

      const nextQuestion = await generateInterviewQuestion({                               // Generate the next interview question
      interviewType: interview.interviewType,
      subject: interview.subject,
      topic: interview.topic,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      previousQuestions
      });
  
      interview.questions.push({                                  // Push the new unanswered question into questions[]
      question: nextQuestion.question,
      answer: "",
      score: null,
      feedback: ""
      });

      await interview.save();                                       // Save evaluated answer and next generated question

      return res.status(200).json({success: true,message: "Answer evaluated and next question generated successfully.",

      evaluation: 
      {
        score: currentQuestion.score,
        feedback: currentQuestion.feedback
      },
      interview: 
      {
        status: interview.status,
        currentQuestion: nextQuestion.question,
        questionNumber: interview.questions.length,
        totalQuestions: interview.numberOfQuestions
      }
      });
    }
    const totalScore = interview.questions.reduce((sum, question) => sum + question.score,0);
    const overallScore = Number((totalScore / interview.questions.length).toFixed(2));
    interview.overallScore = overallScore;

    const finalEvaluation = await generateFinalInterviewFeedback({
      interviewType: interview.interviewType,
      subject: interview.subject,
      topic: interview.topic,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      overallScore,
      questions: interview.questions
    });
    interview.finalFeedback = finalEvaluation.finalFeedback;
    interview.status = "Completed";

    await updateSkillConfidence(req.user._id,interview);
    
    await interview.save();
    return res.status(200).json({success: true,message: "Interview completed successfully.",
    evaluation: 
    {
      score: currentQuestion.score,
      feedback: currentQuestion.feedback
    },
    interview: 
    {
      status: interview.status,
      overallScore: interview.overallScore,
      finalFeedback: interview.finalFeedback,
      totalQuestions: interview.numberOfQuestions
    }
    });
  } 
  catch (error) 
  {
    console.error("Submit interview answer failed:", error.message);
    return res.status(500).json({success: false,message: "Failed to submit interview answer."});
  }
};

export const getInterviewHistory = async (req, res) => {
  try 
  {
    const interviews = await Interview.find({candidate: req.user._id}).select("interviewType subject topic targetRole difficulty numberOfQuestions status overallScore createdAt").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Interview history fetched successfully.",
      count: interviews.length,
      interviews
    });

  } 
  catch (error) 
  {
    console.error("Get interview history failed:",error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview history."
    });

  }
};

export const getInterviewReport = async (req, res) => {
  try 
  { 
    const { interviewId } = req.params;             // Extract interview ID from route parameters

    const interview = await Interview.findById(interviewId);

    if (!interview) 
    {
      return res.status(404).json({success: false,message: "Interview not found."});
    }

    if 
    (
      interview.candidate.toString() !==
      req.user._id.toString()
    ) 
    {
      return res.status(403).json({success: false,message: "You are not authorized to view this interview."});
    }

    return res.status(200).json({success: true,message: "Interview report fetched successfully.",interview});
  } 
  catch (error) 
  {
    console.error("Get interview report failed:",error.message);
    return res.status(500).json({success: false,message: "Failed to fetch interview report."});
  }
};

export const getCandidateAnalytics = async (req, res) => {
  try 
  {
    const interviews = await Interview.find({candidate: req.user._id,});

    const totalInterviews = interviews.length;            // Total interviews includes both completed and in-progress interviews

    const completedInterviews = interviews.filter((interview) => interview.status === "Completed");//overallScore->interview performance

    const completedInterviewsCount = completedInterviews.length;

    const totalScore = completedInterviews.reduce((sum, interview) => sum + interview.overallScore,0);  //total score->complete interviews

    const averageScore = completedInterviewsCount > 0 ? totalScore / completedInterviewsCount: 0;

    // Math.max on an empty array returns -Infinity.
    const bestScore = completedInterviewsCount > 0 ? Math.max(...completedInterviews.map((interview) => interview.overallScore)): 0;
    
    const recentPerformance = completedInterviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((interview) => ({
      subject: interview.subject,
      topic: interview.topic,
      overallScore: interview.overallScore,
      createdAt: interview.createdAt,
    }));

    return res.status(200).json({success: true,message: "Candidate analytics fetched successfully.",
    analytics: {
      totalInterviews,
      completedInterviews: completedInterviewsCount,
      averageScore: Number(averageScore.toFixed(2)),
      bestScore,
      recentPerformance,
    },
    });
  } 
  catch (error) 
  {
    console.error("Candidate Analytics Error:", error);
    return res.status(500).json({success: false,message: "Failed to fetch candidate analytics.",error: error.message,});
  }
};