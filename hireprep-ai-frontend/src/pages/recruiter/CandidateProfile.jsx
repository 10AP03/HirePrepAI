import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const CandidateProfile = () => {

  const navigate = useNavigate();

  const { id: candidateId } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [resume, setResume] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchCandidateProfile();

    fetchInterviewHistory();

  }, []);

  const fetchCandidateProfile = async () => {

    try {

      const response = await api.get(

        `/recruiter/candidates/${candidateId}`

      );

      if (response.data.success) {

        setCandidate(response.data.candidate);

        setResume(response.data.resume);

      }

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to fetch candidate profile."

      );

    }

  };

  const fetchInterviewHistory = async () => {

    try {

      const response = await api.get(

        `/recruiter/candidates/${candidateId}/interviews`

      );

      if (response.data.success) {

        setInterviews(response.data.interviews);

      }

    }
    catch (err) {

      console.error(err);

    }
    finally {

      setLoading(false);

    }

  };

  const fetchInterviewReport = async (interviewId) => {

    try {

      const response = await api.get(

        `/recruiter/candidates/${candidateId}/interviews/${interviewId}`

      );

      if (response.data.success) {

        setSelectedReport(response.data.interview);

      }

    }
    catch (err) {

      console.error(err);

    }

  };

  if (loading) {

    return (

      <div className="flex justify-center items-center h-screen bg-[#05070f]">

        <h2 className="text-xl font-semibold text-cyan-400 animate-pulse">

          Loading Candidate Profile...

        </h2>

      </div>

    );

  }

  if (!candidate) {

    return (

      <div className="min-h-screen bg-[#05070f] p-6 text-[#f87171]">

        {error}

      </div>

    );

  }
  return (

    <div className="min-h-screen bg-[#05070f] max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8 text-white">

        Candidate Profile

      </h1>

      {/* Candidate */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-5 text-white">

          Candidate Information

        </h2>

        <div className="space-y-3 text-gray-300">

          <p><strong className="text-gray-400">Name :</strong> {candidate.name}</p>

          <p><strong className="text-gray-400">Email :</strong> {candidate.email}</p>

          <p>

            <strong className="text-gray-400">Registered :</strong>{" "}

            {new Date(candidate.createdAt).toLocaleDateString()}

          </p>

        </div>

      </div>

      {/* Resume */}

      {resume && (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-semibold mb-5 text-white">

            Resume Analysis

          </h2>

          <div className="space-y-2 text-gray-300">

            <p><strong className="text-gray-400">File :</strong> {resume.fileName}</p>

            <p><strong className="text-gray-400">Status :</strong> {resume.status}</p>

            <p><strong className="text-gray-400">ATS Score :</strong> {resume.atsScore}</p>

          </div>

          <p className="mt-4 font-semibold text-white">

            Skills

          </p>

          <div className="flex flex-wrap gap-2 mt-2">

            {resume.extractedSkills.map((skill,index)=>(

              <span

                key={index}

                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full"

              >

                {skill}

              </span>

            ))}

          </div>

          <div className="mt-6">

            <h3 className="font-semibold mb-2 text-white">

              AI Feedback

            </h3>

            <div className="bg-[#05070f] border border-[#091520] rounded p-4 whitespace-pre-line text-gray-300">

              {resume.aiFeedback}

            </div>

          </div>

        </div>

      )}

      {/* Interview History */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-5 text-white">

          Interview History

        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-[#091520]">

              <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">Subject</th>

              <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">Topic</th>

              <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">Score</th>

              <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">Status</th>

              <th className="text-left py-3 text-gray-400 text-sm uppercase tracking-wide">Action</th>

            </tr>

          </thead>

          <tbody>

            {interviews.map((item)=>(

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

                <td className="py-3 text-cyan-400 font-semibold">

                  {item.overallScore ?? "-"}

                </td>

                <td className="py-3 text-gray-200">

                  {item.status}

                </td>

                <td className="py-3">

                  <button

                    onClick={()=>fetchInterviewReport(item._id)}

                    className="bg-[#34d399] hover:bg-emerald-400 text-[#05070f] font-semibold px-4 py-2 rounded transition-colors"

                  >

                    View Report

                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Selected Report */}

      {selectedReport && (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-semibold mb-6 text-white">

            Interview Report

          </h2>

          <p className="text-gray-300">

            <strong className="text-gray-400">Overall Score :</strong>{" "}

            {selectedReport.overallScore}

          </p>

          <div className="mt-4">

            <h3 className="font-semibold text-white">

              Final Feedback

            </h3>

            <div className="bg-[#05070f] border border-[#091520] rounded p-4 mt-2 whitespace-pre-line text-gray-300">

              {selectedReport.finalFeedback}

            </div>

          </div>

        </div>

      )}

      <button

        onClick={()=>navigate("/recruiter/candidates")}

        className="bg-[#0a1420] hover:bg-[#0f1c2c] border border-[#091520] hover:border-cyan-500/50 text-white px-6 py-2 rounded transition-colors"

      >

        Back to Candidates

      </button>

    </div>

  );

};

export default CandidateProfile;