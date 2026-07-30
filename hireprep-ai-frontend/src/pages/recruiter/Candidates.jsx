import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Candidates = () => {

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchCandidates();

  }, []);

  const fetchCandidates = async () => {

    try {

      setLoading(true);

      const response = await api.get("/recruiter/candidates");

      if (response.data.success) {

        setCandidates(response.data.candidates);

      }

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to fetch candidates."

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

          Loading Candidates...

        </h2>

      </div>

    );

  }

  if (error) {

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

        Candidates

      </h1>

      {candidates.length === 0 ? (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

          <p className="text-gray-400">No candidates found.</p>

        </div>

      ) : (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

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
                    Registered On
                  </th>

                  <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {candidates.map((candidate) => (

                  <tr
                    key={candidate._id}
                    className="border-b border-[#091520] hover:bg-[#091520]/40 transition-colors"
                  >

                    <td className="py-4 text-gray-200">

                      {candidate.name}

                    </td>

                    <td className="py-4 text-gray-200">

                      {candidate.email}

                    </td>

                    <td className="py-4 text-gray-400">

                      {new Date(candidate.createdAt).toLocaleDateString()}

                    </td>

                    <td className="py-4">

                      <button

                        onClick={() =>
                          navigate(`/recruiter/candidate/${candidate._id}`)
                        }

                        className="bg-cyan-500 hover:bg-cyan-400 text-[#05070f] font-semibold px-4 py-2 rounded transition-colors"

                      >

                        View Profile

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      <div className="mt-8">

        <button

          onClick={() =>
            navigate("/recruiter/dashboard")
          }

          className="bg-[#0a1420] hover:bg-[#0f1c2c] border border-[#091520] hover:border-cyan-500/50 text-white px-6 py-2 rounded transition-colors"

        >

          Back to Dashboard

        </button>

      </div>

    </div>

  );

};

export default Candidates;