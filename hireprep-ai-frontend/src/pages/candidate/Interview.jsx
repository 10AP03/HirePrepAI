import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { FaMicrophone, FaStop, FaVolumeUp } from "react-icons/fa";

const Interview = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // Interview Configuration

  const [interviewType, setInterviewType] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  // Interview State

  const [interviewId, setInterviewId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Candidate Answer

  const [answer, setAnswer] = useState("");

  // Evaluation

  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Page State

  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Voice State

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const recognitionRef = useRef(null);

  // Check browser support once on mount

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition || !window.speechSynthesis) {
      setVoiceSupported(false);
    }

  }, []);

  // NEW: If arriving from a claimed scheduled interview, skip the config
  // form and jump straight into the in-progress screen using the data
  // already returned by claimScheduledInterview.

  useEffect(() => {

    const claimedInterview = location.state?.claimedInterview;

    if (claimedInterview) {

      setInterviewId(claimedInterview.interviewId);
      setCurrentQuestion(claimedInterview.currentQuestion);
      setQuestionNumber(claimedInterview.questionNumber);
      setTotalQuestions(claimedInterview.totalQuestions);

      setStarted(true);

    }

  }, [location.state]);

  // Read the current question aloud whenever it changes

  useEffect(() => {

    if (started && currentQuestion && voiceSupported) {

      speakQuestion(currentQuestion);

    }

    // Stop any ongoing speech when leaving the page

    return () => {
      window.speechSynthesis?.cancel();
    };

  }, [currentQuestion, started]);

  const speakQuestion = (text) => {

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);

  };

  const startRecording = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Stop the AI from speaking if user starts talking

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = answer ? answer + " " : "";

    recognition.onresult = (event) => {

      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {

        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }

      }

      setAnswer(finalTranscript + interimTranscript);

    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    recognition.start();

    setIsRecording(true);

  };

  const stopRecording = () => {

    recognitionRef.current?.stop();

    setIsRecording(false);

  };

  const toggleRecording = () => {

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }

  };

  const handleStartInterview = async () => {

    if (
      !interviewType ||
      !subject ||
      !topic ||
      !targetRole ||
      !difficulty
    ) {

      return setError("Please fill all fields.");

    }

    try {

      setLoading(true);
      setError("");

      const response = await api.post("/interviews/start", {

        interviewType,
        subject,
        topic,
        targetRole,
        difficulty,
        numberOfQuestions

      });

      if (response.data.success) {

        const data = response.data.interview;

        setInterviewId(data.interviewId);
        setCurrentQuestion(data.currentQuestion);
        setQuestionNumber(data.questionNumber);
        setTotalQuestions(data.totalQuestions);

        setStarted(true);

      }

    }
    catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to start interview."
      );

    }
    finally {

      setLoading(false);

    }

  };

  const handleSubmitAnswer = async () => {

    if (isRecording) {
      stopRecording();
    }

    if (!answer.trim()) {

      return setError("Please record or enter your answer.");

    }

    try {

      setLoading(true);
      setError("");

      const response = await api.post(

        `/interviews/${interviewId}/answer`,

        {
          answer
        }

      );

      const data = response.data;

      setScore(data.evaluation.score);
      setFeedback(data.evaluation.feedback);

      // Interview Finished

      if (
        data.interview.status === "Completed"
      ) {

        navigate(`/candidate/interview-report/${interviewId}`);

        return;

      }

      // Next Question

      setCurrentQuestion(
        data.interview.currentQuestion
      );

      setQuestionNumber(
        data.interview.questionNumber
      );

      setTotalQuestions(
        data.interview.totalQuestions
      );

      setAnswer("");

    }
    catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to submit answer."
      );

    }
    finally {

      setLoading(false);

    }

  };
  return (
    <div className="min-h-screen bg-[#05070f] max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-white">
        AI Interview
      </h1>

      {!voiceSupported && (
        <div className="mb-4 rounded border border-[#fb923c]/40 bg-[#fb923c]/10 p-3 text-[#fb923c]">
          Voice features are not supported in this browser. Please use Chrome or Edge for the full oral interview experience.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-[#f87171]/40 bg-[#f87171]/10 p-3 text-[#f87171]">
          {error}
        </div>
      )}

      {/* Interview Configuration */}

      {!started && (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Interview Type
              </label>

              <input
                type="text"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                placeholder="Technical / HR"
                className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Java"
                className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Topic
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Collections"
                className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Target Role
              </label>

              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Backend Developer"
                className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 text-gray-300">
                Difficulty
              </label>

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
              <label className="block font-medium mb-2 text-gray-300">
                Number of Questions
              </label>

              <input
                type="number"
                min="1"
                max="10"
                value={numberOfQuestions}
                onChange={(e) =>
                  setNumberOfQuestions(Number(e.target.value))
                }
                className="w-full bg-[#05070f] border border-[#091520] rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

          </div>

          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="mt-6 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#05070f] font-semibold px-6 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>

        </div>

      )}

      {/* Interview Screen */}

      {started && (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-semibold text-white">
              Question {questionNumber} / {totalQuestions}
            </h2>

            <button
              onClick={() => speakQuestion(currentQuestion)}
              disabled={isSpeaking}
              title="Replay question"
              className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition-colors"
            >
              <FaVolumeUp className={isSpeaking ? "animate-pulse" : ""} />
              {isSpeaking ? "Speaking..." : "Replay"}
            </button>

          </div>

          <div className="border border-[#091520] rounded p-4 bg-[#05070f] mb-6 text-gray-200">

            {currentQuestion}

          </div>

          <div className="flex flex-col items-center gap-4 mb-6">

            <button
              onClick={toggleRecording}
              disabled={loading}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all ${
                isRecording
                  ? "bg-[#f87171] shadow-[0_0_25px_rgba(248,113,113,0.6)] animate-pulse"
                  : "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              } text-[#05070f]`}
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>

            <p className="text-sm text-gray-400">
              {isRecording ? "Recording... tap to stop" : "Tap the mic to answer"}
            </p>

          </div>

          <textarea
            rows="8"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your spoken answer will appear here — you can also type or edit it directly..."
            className="w-full bg-[#05070f] border border-[#091520] rounded p-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />

          <button
            onClick={handleSubmitAnswer}
            disabled={loading}
            className="mt-5 bg-[#34d399] hover:bg-emerald-400 disabled:opacity-50 text-[#05070f] font-semibold px-6 py-2 rounded transition-colors"
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>

          {/* Previous Evaluation */}

          {score !== null && (

            <div className="mt-8 border-t border-[#091520] pt-6">

              <h3 className="text-xl font-semibold mb-4 text-white">
                Previous Answer Evaluation
              </h3>

              <div className="mb-4">

                <p className="font-medium text-gray-400">
                  Score
                </p>

                <p className="text-2xl text-cyan-400 font-bold">
                  {score}/10
                </p>

              </div>

              <div>

                <p className="font-medium mb-2 text-gray-400">
                  AI Feedback
                </p>

                <div className="border border-[#091520] rounded bg-[#05070f] p-4 whitespace-pre-line text-gray-200">

                  {feedback}

                </div>

              </div>

            </div>

          )}

        </div>

      )}

    </div>
  );

};

export default Interview;