import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import RecruiterOverviewChart from "../../components/charts/recruiter/RecruiterOverviewChart";
import TopPerformersChart from "../../components/charts/recruiter/TopPerformersChart";

const Dashboard = () => {

  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchRecruiterAnalytics();

  }, []);

  const fetchRecruiterAnalytics = async () => {

    try {

      setLoading(true);

      const response = await api.get("/recruiter/analytics");

      if (response.data.success) {

        setAnalytics(response.data.analytics);

      }

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to load recruiter dashboard."

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

          Loading Recruiter Dashboard...

        </h2>

      </div>

    );

  }

  if (!analytics) {

    return (

      <div className="min-h-screen bg-[#05070f] p-6">

        <h2 className="text-[#f87171]">

          {error}

        </h2>

      </div>

    );

  }
  return (
    <div className="min-h-screen bg-[#05070f] max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8 text-white">
        Recruiter Dashboard
      </h1>

      {/* Analytics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 hover:border-cyan-500/40 transition-colors">

          <h2 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Total Candidates
          </h2>

          <p className="text-3xl font-bold text-cyan-400">
            {analytics.totalCandidates}
          </p>

        </div>

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 hover:border-cyan-500/40 transition-colors">

          <h2 className="text-gray-400 mb-2 text-sm uppercase tracking-wide">
            Total Interviews
          </h2>

          <p className="text-3xl font-bold text-[#3b82f6]">
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

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <RecruiterOverviewChart
          totalCandidates={analytics.totalCandidates}
          totalInterviews={analytics.totalInterviews}
          completedInterviews={analytics.completedInterviews}
        />

        <TopPerformersChart candidates={analytics.topPerformingCandidates} />

      </div>

      {/* Top Performing Candidates */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

        <h2 className="text-2xl font-semibold mb-6 text-white">
          Top Performing Candidates
        </h2>

        {analytics.topPerformingCandidates.length === 0 ? (

          <p className="text-gray-400">No completed interviews yet.</p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-[#091520]">

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Name
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Email
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Average Score
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Completed Interviews
                  </th>

                </tr>

              </thead>

              <tbody>

                {analytics.topPerformingCandidates.map((candidate) => (

                  <tr
                    key={candidate.candidateId}
                    className="border-b border-[#091520] hover:bg-[#091520]/40 transition-colors"
                  >

                    <td className="py-3 text-gray-200">

                      {candidate.name}

                    </td>

                    <td className="py-3 text-gray-200">

                      {candidate.email}

                    </td>

                    <td className="py-3 font-semibold text-cyan-400">

                      {candidate.averageScore}

                    </td>

                    <td className="py-3 text-gray-200">

                      {candidate.completedInterviews}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Quick Actions */}

      <div className="mt-8 flex gap-4">

        <button
          onClick={() => navigate("/recruiter/candidates")}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#05070f] font-semibold px-6 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
        >
          View Candidates
        </button>

      </div>

    </div>
  );

};

export default Dashboard;