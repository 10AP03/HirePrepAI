import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

const InterviewReport = () => {

  const navigate = useNavigate();
  const { id: interviewId } = useParams();

  const [interview, setInterview] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchInterviewReport();

  }, []);

  const fetchInterviewReport = async () => {

    try {

      setLoading(true);

      // FIX: was "/interview/${interviewId}" (singular) — correct endpoint is "/interviews/${interviewId}"
      const response = await api.get(

        `/interviews/${interviewId}`

      );

      if (response.data.success) {

        setInterview(response.data.interview);

      }

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to fetch interview report."

      );

    }
    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="flex items-center justify-center h-screen bg-[#05070f]">

        <h2 className="text-xl font-semibold text-cyan-400 animate-pulse">

          Loading Interview Report...

        </h2>

      </div>

    );

  }

  if (!interview) {

    return (

      <div className="min-h-screen bg-[#05070f] p-6">

        <h2 className="text-[#f87171]">

          {error}

        </h2>

      </div>

    );

  }
  return (
    <div className="min-h-screen bg-[#05070f] max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-white">
        Interview Report
      </h1>

      {/* Interview Details */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-5 text-white">
          Interview Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">

          <p>
            <strong className="text-gray-400">Interview Type :</strong> {interview.interviewType}
          </p>

          <p>
            <strong className="text-gray-400">Subject :</strong> {interview.subject}
          </p>

          <p>
            <strong className="text-gray-400">Topic :</strong> {interview.topic}
          </p>

          <p>
            <strong className="text-gray-400">Target Role :</strong> {interview.targetRole}
          </p>

          <p>
            <strong className="text-gray-400">Difficulty :</strong> {interview.difficulty}
          </p>

          <p>
            <strong className="text-gray-400">Status :</strong> {interview.status}
          </p>

          <p>
            <strong className="text-gray-400">Total Questions :</strong> {interview.numberOfQuestions}
          </p>

          <p>
            <strong className="text-gray-400">Overall Score :</strong>{" "}
            {interview.overallScore ?? "N/A"}
          </p>

        </div>

      </div>

      {/* Final Feedback */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-4 text-white">
          Final AI Feedback
        </h2>

        <div className="border border-[#091520] rounded bg-[#05070f] p-4 whitespace-pre-line text-gray-300">

          {interview.finalFeedback || "No feedback available."}

        </div>

      </div>

      {/* Question Wise Report */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-6 text-white">
          Question Wise Evaluation
        </h2>

        <div className="space-y-8">

          {interview.questions.map((question, index) => (

            <div
              key={index}
              className="border border-[#091520] rounded-lg p-5 hover:border-cyan-500/30 transition-colors"
            >

              <h3 className="text-lg font-semibold mb-3 text-cyan-400">

                Question {index + 1}

              </h3>

              <div className="mb-4">

                <p className="font-medium text-gray-400">

                  Question

                </p>

                <p className="mt-1 text-gray-200">

                  {question.question}

                </p>

              </div>

              <div className="mb-4">

                <p className="font-medium text-gray-400">

                  Candidate Answer

                </p>

                <div className="bg-[#05070f] border border-[#091520] rounded p-3 mt-2 whitespace-pre-line text-gray-200">

                  {question.answer || "No answer submitted"}

                </div>

              </div>

              <div className="mb-4">

                <p className="font-medium text-gray-400">

                  AI Score

                </p>

                <p className="text-cyan-400 text-xl font-bold">

                  {question.score ?? "N/A"} / 10

                </p>

              </div>

              <div>

                <p className="font-medium text-gray-400">

                  AI Feedback

                </p>

                <div className="bg-[#05070f] border border-[#091520] rounded p-3 mt-2 whitespace-pre-line text-gray-200">

                  {question.feedback || "No feedback available."}

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Buttons */}

      <div className="flex gap-4">

        <button
          onClick={() => navigate("/candidate/interview")}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#05070f] font-semibold px-6 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
        >
          New Interview
        </button>

        <button
          onClick={() => navigate("/candidate/dashboard")}
          className="bg-[#0a1420] hover:bg-[#0f1c2c] border border-[#091520] hover:border-cyan-500/50 text-white px-6 py-2 rounded transition-colors"
        >
          Dashboard
        </button>

      </div>

    </div>
  );

};

export default InterviewReport;