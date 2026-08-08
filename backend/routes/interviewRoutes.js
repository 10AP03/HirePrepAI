import express from "express";
import { startInterview, submitInterviewAnswer, getInterviewHistory, getInterviewReport, getCandidateAnalytics } from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getOpenScheduledInterviews, claimScheduledInterview } from "../controllers/interviewController.js";


const router = express.Router();

router.post("/start", protect, startInterview);

router.post("/:interviewId/answer",protect,submitInterviewAnswer);

router.get("/history",protect,getInterviewHistory);

router.get("/analytics",protect,getCandidateAnalytics);

router.get("/:interviewId",protect,getInterviewReport);

router.get("/scheduled", protect, getOpenScheduledInterviews);

router.post("/scheduled/:scheduledId/claim", protect, claimScheduledInterview);

export default router;