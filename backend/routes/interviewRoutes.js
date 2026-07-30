import express from "express";
import { startInterview, submitInterviewAnswer, getInterviewHistory, getInterviewReport, getCandidateAnalytics } from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", protect, startInterview);

router.post("/:interviewId/answer",protect,submitInterviewAnswer);

router.get("/history",protect,getInterviewHistory);

router.get("/analytics",protect,getCandidateAnalytics);

router.get("/:interviewId",protect,getInterviewReport);

export default router;