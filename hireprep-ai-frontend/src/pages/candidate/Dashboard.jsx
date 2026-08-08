import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { getResume } from "../../services/resumeService";

const Dashboard = () => {

  const navigate = useNavigate();

  const [resumeScore, setResumeScore] = useState(null);
  const [totalInterviews, setTotalInterviews] = useState(null);
  const [skillsCount, setSkillsCount] = useState(null);
  const [averageScore, setAverageScore] = useState(null);

  const [loading, setLoading] = useState(true);

  const [scheduledCount, setScheduledCount] = useState(0);

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      // Resume Score
      try {
        const resumeResponse = await getResume();
        if (resumeResponse.success) {
          setResumeScore(resumeResponse.resume?.atsScore ?? null);
        }
      } catch (err) {
        // 404 just means no resume uploaded yet — safe to ignore
        if (err.response?.status !== 404) {
          console.error("Failed to load resume score:", err.message);
        }
      }
      // Scheduled Interviews
      try {
        const scheduledResponse = await api.get("/interviews/scheduled");
        if (scheduledResponse.data.success) {
          setScheduledCount(scheduledResponse.data.count);
        }
      } catch (err) {
        console.error("Failed to load scheduled interviews:", err.message);
      }

      // Interview Analytics
      try {
        const analyticsResponse = await api.get("/interviews/analytics");
        if (analyticsResponse.data.success) {
          setTotalInterviews(analyticsResponse.data.analytics.totalInterviews);
          setAverageScore(analyticsResponse.data.analytics.averageScore);
        }
      } catch (err) {
        console.error("Failed to load interview analytics:", err.message);
      }

      // Skill Profile
      try {
        const skillResponse = await api.get("/skills/profile");
        if (skillResponse.data.success) {
          setSkillsCount(skillResponse.data.profile?.skills?.length ?? 0);
        }
      } catch (err) {
        console.error("Failed to load skill profile:", err.message);
      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="space-y-6">

      <div>
  <h1 className="text-3xl font-bold text-white">
    Candidate Dashboard
  </h1>
  <p className="text-gray-400">
    Welcome to HirePrep AI
  </p>
</div>

{scheduledCount > 0 && (
  <div
    onClick={() => navigate("/candidate/scheduled-interviews")}
    className="cursor-pointer bg-cyan-500/10 border border-cyan-500/40 rounded-lg p-4 flex items-center justify-between hover:bg-cyan-500/20 transition-colors"
  >
    <p className="text-cyan-400 font-medium">
      🔔 {scheduledCount} recruiter-scheduled interview{scheduledCount > 1 ? "s" : ""} available now
    </p>
    <span className="text-cyan-400 text-sm">View →</span>
  </div>
)}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-[#060a12] border border-[#091520] shadow-lg rounded-lg p-5 hover:border-cyan-500/40 transition-colors">
          <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-wide">
            Resume Score
          </h2>

          <p className="text-3xl mt-3 font-bold text-cyan-400">
            {loading ? "--" : resumeScore !== null ? `${resumeScore}/100` : "--"}
          </p>
        </div>

        <div className="bg-[#060a12] border border-[#091520] shadow-lg rounded-lg p-5 hover:border-cyan-500/40 transition-colors">
          <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-wide">
            Interviews
          </h2>

          <p className="text-3xl mt-3 font-bold text-[#3b82f6]">
            {loading ? "--" : totalInterviews ?? "--"}
          </p>
        </div>

        <div className="bg-[#060a12] border border-[#091520] shadow-lg rounded-lg p-5 hover:border-cyan-500/40 transition-colors">
          <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-wide">
            Skills
          </h2>

          <p className="text-3xl mt-3 font-bold text-[#34d399]">
            {loading ? "--" : skillsCount ?? "--"}
          </p>
        </div>

        <div className="bg-[#060a12] border border-[#091520] shadow-lg rounded-lg p-5 hover:border-cyan-500/40 transition-colors">
          <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-wide">
            Progress
          </h2>

          <p className="text-3xl mt-3 font-bold text-[#fb923c]">
            {loading ? "--" : averageScore !== null ? `${averageScore}/10` : "--"}
          </p>
        </div>

      </div>

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

        <h2 className="text-xl font-semibold mb-3 text-white">
          Quick Actions
        </h2>

        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() => navigate("/candidate/resume")}
            className="bg-cyan-500 hover:bg-cyan-400 text-[#05070f] font-semibold px-5 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
          >
            Upload Resume
          </button>

          <button
            onClick={() => navigate("/candidate/resume-analysis")}
            className="bg-[#3b82f6] hover:bg-blue-400 text-white font-semibold px-5 py-2 rounded transition-colors"
          >
            Analyze Resume
          </button>

          <button
            onClick={() => navigate("/candidate/interview")}
            className="bg-[#0a1420] hover:bg-[#0f1c2c] border border-cyan-500/50 text-cyan-400 font-semibold px-5 py-2 rounded transition-colors"
          >
            Start Interview
          </button>

        </div>

      </div>

    </div>

  );
};

export default Dashboard;