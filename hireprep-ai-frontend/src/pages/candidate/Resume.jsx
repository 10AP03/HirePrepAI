import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  uploadResume,
  getResume,
  updateResume,
  deleteResume,
} from "../../services/resumeService";

const Resume = () => {
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to fetch resume.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setError("");
    setSuccess("");

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return setError("Please select a PDF resume.");
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await uploadResume(formData);

      if (response.success) {
        setSuccess(response.message);
        setResume(response.resume);
        setSelectedFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      return setError("Select a new PDF first.");
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await updateResume(formData);

      if (response.success) {
        setResume(response.resume);
        setSuccess(response.message);
        setSelectedFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your resume?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await deleteResume();

      if (response.success) {
        setResume(null);
        setSelectedFile(null);
        setSuccess(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAnalyze = () => {
    navigate("/candidate/resume-analysis");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#05070f]">
        <h2 className="text-xl font-semibold text-cyan-400 animate-pulse">Loading Resume...</h2>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#05070f] max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-white">
        Resume Management
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

      {/* Upload / Update Resume */}

      <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-4 text-white">
          {resume ? "Update Resume" : "Upload Resume"}
        </h2>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full mb-4 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#0a1420] file:text-cyan-400 hover:file:bg-[#0f1c2c]"
        />

        {!resume ? (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#05070f] font-semibold px-5 py-2 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            disabled={updating}
            className="bg-[#fb923c] hover:bg-orange-400 disabled:opacity-50 text-[#05070f] font-semibold px-5 py-2 rounded transition-colors"
          >
            {updating ? "Updating..." : "Update Resume"}
          </button>
        )}

      </div>

      {/* Resume Details */}

      {resume && (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

          <h2 className="text-2xl font-semibold mb-6 text-white">
            Current Resume
          </h2>

          <div className="space-y-4 text-gray-300">

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

            <div>

              <h3 className="font-semibold mb-2 text-white">
                Extracted Skills
              </h3>

              {resume.extractedSkills?.length > 0 ? (

                <div className="flex flex-wrap gap-2">

                  {resume.extractedSkills.map((skill, index) => (

                    <span
                      key={index}
                      className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              ) : (

                <p className="text-gray-500">No skills extracted yet.</p>

              )}

            </div>

            <div>

              <h3 className="font-semibold mb-2 text-white">
                AI Feedback
              </h3>

              <p className="text-gray-400 whitespace-pre-line">
                {resume.aiFeedback || "Resume not analyzed yet."}
              </p>

            </div>

            <div className="flex flex-wrap gap-4 pt-6">

              <button
                onClick={handleAnalyze}
                className="bg-[#34d399] hover:bg-emerald-400 text-[#05070f] font-semibold px-5 py-2 rounded transition-colors"
              >
                Analyze Resume
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-[#f87171] hover:bg-red-400 disabled:opacity-50 text-[#05070f] font-semibold px-5 py-2 rounded transition-colors"
              >
                {deleting ? "Deleting..." : "Delete Resume"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Resume;