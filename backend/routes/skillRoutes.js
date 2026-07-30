import express from "express";
import { getSkillProfile } from "../controllers/skillController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile",protect,getSkillProfile);

export default router;