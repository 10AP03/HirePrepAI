// Import Express
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
// Import Resume Controller Functions
import {
  uploadResume,
  analyzeResume,
  getResume,
  updateResume,
  deleteResume
} from "../controllers/resumeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();                      // Create Router

// Resume Routes
router.post("/upload", protect,upload.single("resume") ,uploadResume);        // Upload a new Resume

router.post("/analyze", protect, analyzeResume);      // Analyze the uploaded Resume 

router.get("/", protect, getResume);                  // Get the logged-in user's Resume

router.put("/", protect, upload.single("resume"),updateResume);               // Update the current Resume

router.delete("/", protect, deleteResume);            // Delete the current Resume

export default router;                                // Export Router