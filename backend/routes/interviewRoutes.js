import express from "express";
import {
  startInterview,
  submitInterviewAnswer,
  getInterviewHistory,
  getInterviewReport,
  getCandidateAnalytics,
  getOpenScheduledInterviews,
  claimScheduledInterview
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startInterview);

router.post("/:interviewId/answer", protect, submitInterviewAnswer);

router.get("/history", protect, getInterviewHistory);

router.get("/analytics", protect, getCandidateAnalytics);

router.get("/scheduled", protect, getOpenScheduledInterviews);

router.post("/scheduled/:scheduledId/claim", protect, claimScheduledInterview);

router.get("/:interviewId", protect, getInterviewReport);

export default router;