import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Authentication Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Candidate Pages
import Dashboard from "../pages/candidate/Dashboard";
import Resume from "../pages/candidate/Resume";
import ResumeAnalysis from "../pages/candidate/ResumeAnalysis";
import Interview from "../pages/candidate/Interview";
import InterviewReport from "../pages/candidate/InterviewReport";
import Analytics from "../pages/candidate/Analytics";
import SkillDashboard from "../pages/candidate/SkillDashboard";
import InterviewHistory from "../pages/candidate/InterviewHistory";

// Recruiter Pages
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import Candidates from "../pages/recruiter/Candidates";
import CandidateProfile from "../pages/recruiter/CandidateProfile";

// Layouts
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Redirect Home */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Candidate Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/candidate" element={<CandidateLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="resume" element={<Resume />} />
                        <Route path="resume-analysis" element={<ResumeAnalysis />} />
                        <Route path="interview" element={<Interview />} />
                        <Route path="interview-report/:id" element={<InterviewReport />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="skill-dashboard" element={<SkillDashboard />} />
                        <Route path="interview-history" element={<InterviewHistory />} />
                        <Route path="scheduled-interviews" element={<ScheduledInterviews />} /> {/* candidate block */}
                        <Route path="create-interview" element={<CreateInterview />} /> {/* recruiter block */}
                    </Route>
                </Route>

                {/* Protected Recruiter Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/recruiter" element={<RecruiterLayout />}>
                        <Route path="dashboard" element={<RecruiterDashboard />} />
                        <Route path="candidates" element={<Candidates />} />
                        <Route path="candidate/:id" element={<CandidateProfile />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;