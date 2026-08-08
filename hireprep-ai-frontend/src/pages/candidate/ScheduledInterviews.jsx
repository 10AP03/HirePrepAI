import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ScheduledInterviews = () => {

  const navigate = useNavigate();

  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    fetchScheduled();

  }, []);

  const fetchScheduled = async () => {

    try {
      setLoading(true);
      const response = await api.get("/interviews/scheduled");
      if (response.data.success) {
        setScheduledInterviews(response.data.scheduledInterviews);
      }
    }
    catch (err) {
      setError(err.response?.data?.message || "Failed to load scheduled interviews.");
    }
    finally {
      setLoading(false);
    }

  };

  const handleClaim = async (scheduledId) => {

    try {

      setClaimingId(scheduledId);
      setError("");

      const response = await api.post(`/interviews/scheduled/${scheduledId}/claim`);

      if (response.data.success) {
        // Redirect straight into the live interview using the returned interview data
        navigate("/candidate/interview", {
          state: { claimedInterview: response.data.interview }
        });
      }

    }
    catch (err) {
      setError(err.response?.data?.message || "Failed to claim this interview.");
      fetchScheduled();
    }
    finally {
      setClaimingId(null);
    }

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#05070f]">
        <h2 className="text-xl font-semibold text-cyan-400 animate-pulse">
          Loading Scheduled Interviews...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070f] max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-2 text-white">
        Scheduled Interviews
      </h1>

      <p className="text-gray-400 mb-6 text-sm">
        Interviews created by recruiters — first come, first served.
      </p>

      {error && (
        <div className="mb-6 rounded border border-[#f87171]/40 bg-[#f87171]/10 p-3 text-[#f87171]">
          {error}
        </div>
      )}

      {scheduledInterviews.length === 0 ? (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">
          <p className="text-gray-400">No scheduled interviews available right now.</p>
        </div>

      ) : (

        <div className="space-y-4">

          {scheduledInterviews.map((item) => (

            <div
              key={item._id}
              className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-cyan-500/40 transition-colors"
            >

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {item.subject} — {item.topic}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {item.interviewType} · {item.targetRole} · {item.difficulty} · {item.numberOfQuestions} Questions
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Posted by {item.recruiter?.name || "Recruiter"}
                </p>
              </div>

              <button
                onClick={() => handleClaim(item._id)}
                disabled={claimingId === item._id}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#05070f] font-semibold px-5 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors whitespace-nowrap"
              >
                {claimingId === item._id ? "Claiming..." : "Start Now"}
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default ScheduledInterviews;