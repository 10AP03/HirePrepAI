import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume, getResume } from "../../services/resumeService";

const ResumeAnalysis = () => {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);

      const response = await getResume();

      if (response.success) {
        setResume(response.resume);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError("");
      setSuccess("");

      const response = await analyzeResume();

      if (response.success) {
        setSuccess(response.message);

        setResume((prev) => ({
          ...prev,
          atsScore: response.analysis.atsScore,
          extractedSkills: response.analysis.extractedSkills,
          aiFeedback: response.analysis.aiFeedback,
          status: response.analysis.status,
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Resume analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#05070f]">
        <h2 className="text-xl font-semibold text-cyan-400 animate-pulse">
          Loading Resume...
        </h2>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#05070f] max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-white">
        Resume Analysis
      </h1>

      {/* Success Message */}
      {success && (
        <div className="mb-4 rounded border border-[#34d399]/40 bg-[#34d399]/10 p-3 text-[#34d399]">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 rounded border border-[#f87171]/40 bg-[#f87171]/10 p-3 text-[#f87171]">
          {error}
        </div>
      )}

      {/* Resume Information */}

      {resume && (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-semibold mb-4 text-white">
            Resume Details
          </h2>

          <div className="space-y-3 text-gray-300">

            <p>
              <strong className="text-gray-400">File Name :</strong> {resume.fileName}
            </p>

            <p>
              <strong className="text-gray-400">Status :</strong> {resume.status}
            </p>

            <p>
              <strong className="text-gray-400">ATS Score :</strong>{" "}
              {resume.atsScore > 0
                ? `${resume.atsScore}/100`
                : "Not Analyzed"}
            </p>

          </div>

        </div>

      )}

      {/* Analyze Button */}

      <div className="mb-8">

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#05070f] font-semibold px-6 py-3 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
        >
          {analyzing ? "Analyzing Resume..." : "Analyze Resume"}
        </button>

      </div>

      {/* Analysis Result */}

      {resume && resume.status === "Analyzed" && (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

          <h2 className="text-2xl font-semibold mb-6 text-white">
            AI Analysis Report
          </h2>

          {/* ATS */}

          <div className="mb-6">

            <h3 className="text-lg font-semibold text-gray-300">
              ATS Score
            </h3>

            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {resume.atsScore}/100
            </p>

          </div>

          {/* Skills */}

          <div className="mb-6">

            <h3 className="text-lg font-semibold mb-3 text-gray-300">
              Extracted Skills
            </h3>

            {resume.extractedSkills?.length > 0 ? (

              <div className="flex flex-wrap gap-2">

                {resume.extractedSkills.map((skill, index) => (

                  <span
                    key={index}
                    className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            ) : (

              <p className="text-gray-500">No skills detected.</p>

            )}

          </div>

          {/* AI Feedback */}

          <div>

            <h3 className="text-lg font-semibold mb-3 text-gray-300">
              AI Feedback
            </h3>

            <div className="border border-[#091520] rounded p-4 bg-[#05070f] whitespace-pre-line text-gray-300">

              {resume.aiFeedback || "No feedback available."}

            </div>

          </div>

        </div>

      )}

      {/* Back Button */}

      <div className="mt-8">

        <button
          onClick={() => navigate("/candidate/resume")}
          className="bg-[#0a1420] hover:bg-[#0f1c2c] border border-[#091520] hover:border-cyan-500/50 text-white px-5 py-2 rounded transition-colors"
        >
          Back to Resume
        </button>

      </div>

    </div>
  );
};

export default ResumeAnalysis;