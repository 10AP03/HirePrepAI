import "dotenv/config";
import analyzeResumeWithAI from "./services/aiService.js";

const resumeText = `
Arth Patel

B.Tech Artificial Intelligence and Machine Learning student.

Technical Skills:
Python, JavaScript, Node.js, Express.js, MongoDB,
Flask, Scikit-learn, NumPy and Pandas.

Projects:
Loan Default Risk Prediction API.
MERN Expense Tracker.
Sonar Rock vs Mine Classification.
`;

const testAIService = async () => {
    try {
        // Send sample resume text to our AI service
        const analysis = await analyzeResumeWithAI(resumeText);

        // Print the structured JavaScript object
        console.log("===== AI RESUME ANALYSIS =====");
        console.log(analysis);

    } catch (error) {
        // Print the exact error if Groq or parsing fails
        console.error("AI SERVICE TEST FAILED:");
        console.error(error.message);
    }
};

testAIService();