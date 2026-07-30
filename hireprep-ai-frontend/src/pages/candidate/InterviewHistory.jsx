import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const InterviewHistory = () => {

  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchInterviewHistory();

  }, []);

  const fetchInterviewHistory = async () => {

    try {

      setLoading(true);

      const response = await api.get("/interviews/history");

      if (response.data.success) {

        setInterviews(response.data.interviews);

      }

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to load interview history."

      );

    }
    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="flex justify-center items-center h-screen bg-[#05070f]">

        <h2 className="text-xl font-semibold text-cyan-400 animate-pulse">

          Loading Interview History...

        </h2>

      </div>

    );

  }
  return (
    <div className="min-h-screen bg-[#05070f] max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8 text-white">
        Interview History
      </h1>

      {error && (
        <div className="mb-6 rounded border border-[#f87171]/40 bg-[#f87171]/10 p-3 text-[#f87171]">
          {error}
        </div>
      )}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

        {interviews.length === 0 ? (

          <p className="text-gray-400">No interviews taken yet.</p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-[#091520]">

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Subject
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Topic
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Target Role
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Difficulty
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Status
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Score
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Date
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {interviews.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b border-[#091520] hover:bg-[#091520]/40 transition-colors"
                  >

                    <td className="py-3 text-gray-200">
                      {item.subject}
                    </td>

                    <td className="py-3 text-gray-200">
                      {item.topic}
                    </td>

                    <td className="py-3 text-gray-200">
                      {item.targetRole}
                    </td>

                    <td className="py-3 text-gray-200">
                      {item.difficulty}
                    </td>

                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Completed"
                            ? "bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/30"
                            : "bg-[#fb923c]/10 text-[#fb923c] border border-[#fb923c]/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 font-semibold text-cyan-400">
                      {item.overallScore ?? "-"}
                    </td>

                    <td className="py-3 text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3">
                      {item.status === "Completed" ? (
                        <button
                          onClick={() =>
                            navigate(`/candidate/interview-report/${item._id}`)
                          }
                          className="bg-cyan-500 hover:bg-cyan-400 text-[#05070f] font-semibold px-4 py-2 rounded transition-colors"
                        >
                          View Report
                        </button>
                      ) : (
                        <span className="text-gray-600 text-sm">
                          Not Completed
                        </span>
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <div className="mt-8">

        <button
          onClick={() => navigate("/candidate/dashboard")}
          className="bg-[#0a1420] hover:bg-[#0f1c2c] border border-[#091520] hover:border-cyan-500/50 text-white px-6 py-2 rounded transition-colors"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );

};

export default InterviewHistory;