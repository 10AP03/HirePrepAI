import express from "express";
import protect from "../middleware/authMiddleware.js";
import { recruiterOnly } from "../middleware/roleMiddleware.js";
import { getAllCandidates, getCandidateProfile,  getCandidateInterviewHistory, getCandidateInterviewReport,  getRecruiterAnalytics } from "../controllers/recruiterController.js";
import { createScheduledInterview, getMyScheduledInterviews } from "../controllers/recruiterController.js";


const router = express.Router();

router.get("/analytics",protect,recruiterOnly,getRecruiterAnalytics);

router.get("/candidates",protect,recruiterOnly,getAllCandidates);

router.get("/candidates/:candidateId",protect,recruiterOnly,getCandidateProfile);

router.get("/candidates/:candidateId/interviews",protect,recruiterOnly,getCandidateInterviewHistory);

router.get("/candidates/:candidateId/interviews/:interviewId",protect,recruiterOnly,getCandidateInterviewReport);

router.post("/scheduled-interviews", protect, createScheduledInterview);
router.get("/scheduled-interviews", protect, getMyScheduledInterviews);

export default router;