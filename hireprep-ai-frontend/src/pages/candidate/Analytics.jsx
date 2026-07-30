import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import ScoreTrendChart from "../../components/charts/candidate/ScoreTrendChart";
import InterviewSummaryChart from "../../components/charts/candidate/InterviewSummaryChart";

const Analytics = () => {

  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      const response = await api.get("/interviews/analytics");

      if (response.data.success) {

        setAnalytics(response.data.analytics);

      }

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to load analytics."

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

          Loading Analytics...

        </h2>

      </div>

    );

  }

  if (!analytics) {

    return (

      <div className="min-h-screen bg-[#05070f] p-6 text-[#f87171]">

        {error}

      </div>

    );

  }
  return (
    <div className="min-h-screen bg-[#05070f] max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8 text-white">
        Interview Analytics
      </h1>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 hover:border-cyan-500/40 transition-colors">

          <h2 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Total Interviews
          </h2>

          <p className="text-3xl font-bold text-cyan-400">
            {analytics.totalInterviews}
          </p>

        </div>

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 hover:border-cyan-500/40 transition-colors">

          <h2 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Completed Interviews
          </h2>

          <p className="text-3xl font-bold text-[#34d399]">
            {analytics.completedInterviews}
          </p>

        </div>

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 hover:border-cyan-500/40 transition-colors">

          <h2 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Average Score
          </h2>

          <p className="text-3xl font-bold text-[#fb923c]">
            {analytics.averageScore}
          </p>

        </div>

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 hover:border-cyan-500/40 transition-colors">

          <h2 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Best Score
          </h2>

          <p className="text-3xl font-bold text-[#3b82f6]">
            {analytics.bestScore}
          </p>

        </div>

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        <InterviewSummaryChart
          totalInterviews={analytics.totalInterviews}
          completedInterviews={analytics.completedInterviews}
        />

        <ScoreTrendChart data={analytics.recentPerformance} />

      </div>

      {/* Recent Performance */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

        <h2 className="text-2xl font-semibold mb-6 text-white">
          Recent Performance
        </h2>

        {analytics.recentPerformance.length === 0 ? (

          <p className="text-gray-400">No completed interviews yet.</p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="border-b border-[#091520]">

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Subject
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Topic
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Score
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {analytics.recentPerformance.map((item, index) => (

                  <tr
                    key={index}
                    className="border-b border-[#091520] hover:bg-[#091520]/40 transition-colors"
                  >

                    <td className="py-3 text-gray-200">
                      {item.subject}
                    </td>

                    <td className="py-3 text-gray-200">
                      {item.topic}
                    </td>

                    <td className="py-3 font-semibold text-cyan-400">
                      {item.overallScore}
                    </td>

                    <td className="py-3 text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Buttons */}

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

export default Analytics;