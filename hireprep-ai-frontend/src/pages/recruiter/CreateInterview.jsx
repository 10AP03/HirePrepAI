import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateInterview = () => {

  const navigate = useNavigate();

  const [interviewType, setInterviewType] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async () => {

    if (!interviewType || !subject || !topic || !targetRole || !difficulty) {
      return setError("Please fill all fields.");
    }

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post("/recruiter/scheduled-interviews", {
        interviewType,
        subject,
        topic,
        targetRole,
        difficulty,
        numberOfQuestions
      });

      if (response.data.success) {
        setSuccess("Interview scheduled successfully — candidates will now see it on their dashboard.");
        setInterviewType("");
        setSubject("");
        setTopic("");
        setTargetRole("");
        setDifficulty("");
        setNumberOfQuestions(5);
      }

    }
    catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview.");
    }
    finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-[#05070f] max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-white">
        Schedule an Interview
      </h1>

      <p className="text-gray-400 mb-6 text-sm">
        This interview will be made available to all candidates on a first-come, first-served basis.
      </p>

      {success && (
        <div className="mb-4 rounded border border-[#34d399]/40 bg-[#34d399]/10 p-3 text-[#34d399]">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-[#f87171]/40 bg-[#f87171]/10 p-3 text-[#f87171]">
          {error}
        </div>
      )}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block font-medium mb-2 text-gray-300">Interview Type</label>
            <input
              type="text"
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              placeholder="Technical / HR"
              className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Java"
              className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Collections"
              className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Backend Developer"
              className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            >
              <option value="">Select Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-300">Number of Questions</label>
            <input
              type="number"
              min="1"
              max="10"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

        </div>

        <div className="flex gap-4 mt-6">

          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#05070f] font-semibold px-6 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
          >
            {loading ? "Scheduling..." : "Schedule Interview"}
          </button>

          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="bg-[#0a1420] hover:bg-[#0f1c2c] border border-[#091520] hover:border-cyan-500/50 text-white px-6 py-2 rounded transition-colors"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateInterview;