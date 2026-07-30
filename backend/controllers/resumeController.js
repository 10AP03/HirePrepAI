import Resume from "../models/Resume.js";
import extractTextFromPDF from "../utils/pdfParser.js";
import analyzeResumeWithAI from "../services/aiService.js";
import { createOrUpdateSkillProfile } from "../services/skillService.js";

export const uploadResume = async (req, res) => {
    try 
    {
        if (!req.file) {                                // Check if a file was uploaded
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume.",
            });
        }
        const existingResume = await Resume.findOne({                   // Check if the user already has a resume
            user: req.user._id,
        });
        
        if (existingResume) 
        {                                           // Prevent multiple resumes for the same user
            return res.status(409).json({
                success: false,
                message: "Resume already exists. Please use the Update Resume API.",
            });
        }
        const resume = await Resume.create({                             // Create a new resume document
            user: req.user._id,
            resumeFile: req.file.path,
            fileName: req.file.filename,
        });
        res.status(201).json({                                          // Send success response
            success: true,
            message: "Resume uploaded successfully.",
            resume,
        });
    } 
    catch (error) 
    {
        console.error("Upload Resume Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const getResume = async (req, res) => {
    try 
    {
        const resume = await Resume.findOne({                           // Find the resume belonging to the authenticated user
            user: req.user._id,
        });

        if (!resume) 
        {                                                  // If no resume exists
            return res.status(404).json({
                success: false,
                message: "Resume not found.",
            });
        }
        res.status(200).json({                                          // Return the resume
            success: true,
            resume,
        });
    } 
    catch (error) 
    {
        console.error("Get Resume Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const updateResume = async (req, res) => {
    console.log(req.file);
    try 
    {
        if (!req.file) 
        {                                    // Check if a new file was uploaded
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF resume.",
            });
        }
        const resume = await Resume.findOne({               // Find the existing resume
            user: req.user._id,
        });

        if (!resume)                                        // Resume doesn't exist 
        {
            return res.status(404).json({
                success: false,
                message: "Resume not found.",
            });
        }

        resume.resumeFile = req.file.path;                  // Update resume details
        resume.fileName = req.file.filename;
        resume.extractedText = "";                          // Reset AI analysis
        resume.extractedSkills = [];
        resume.atsScore = 0;
        resume.aiFeedback = "";
        resume.status = "Pending";

        await resume.save();

        res.status(200).json({
            success: true,
            message: "Resume updated successfully.",
            resume,
        });

    } 
    catch (error) 
    {
        console.error("Update Resume Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const deleteResume = async (req, res) => {
    try 
    {
        const resume = await Resume.findOne({
            user: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found.",
            });
        }

        await resume.deleteOne();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully.",
        });

    } 
    catch (error) 
    {
        console.error("Delete Resume Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const analyzeResume = async (req, res) => {
    try 
    {   
        const resume = await Resume.findOne({               // Find the resume belonging to the authenticated user.
            user: req.user._id,
        });

        if (!resume)                                        // Checking whether the user resume is stored or not
        {
            return res.status(404).json({
                success: false,
                message: "Resume not found.",
            });
        }
        const extractedText = await extractTextFromPDF(             // Read the stored PDF and extract readable plain text.
            resume.resumeFile
        );

        if (!extractedText || extractedText.trim() === "")          // Validate that usable text was extracted from the PDF.
        {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from resume.",
            });
        }

        const analysis = await analyzeResumeWithAI(extractedText);            // Send the extracted resume text to the AI service
        resume.extractedText = extractedText;                               // Store the extracted text and structured AI analysis
        resume.extractedSkills = analysis.extractedSkills;
        resume.atsScore = analysis.atsScore;
        resume.aiFeedback = analysis.aiFeedback;
        resume.status = "Analyzed";

        await resume.save();                            // Persist the updated Resume document in MongoDB.

        try
        {
            await createOrUpdateSkillProfile(req.user._id,analysis.extractedSkills);
        }
        catch (error)
        {
            console.error("Skill Profile Creation Failed:", error.message);
        }

        return res.status(200).json({                   // Return the completed resume analysis to the client.
            success: true,
            message: "Resume analyzed successfully.",
            analysis: 
            {
                atsScore: resume.atsScore,
                extractedSkills: resume.extractedSkills,
                aiFeedback: resume.aiFeedback,
                status: resume.status,
            },
        });
    } 
    catch (error) 
    {
        console.error("Analyze Resume Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};