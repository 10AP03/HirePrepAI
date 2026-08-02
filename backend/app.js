import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";

const app = express();

// Middleware
app.use(cors({
    origin: ["http://localhost:5173",
        "https://hire-prep-ai-cyan.vercel.app"
    ],
    credentials: true,
}));

app.use(express.json());

// Health Route
app.get("/", (req, res) => {
    res.send("HirePrepAI API is Running...");
});

app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/skills", skillRoutes);

export default app;