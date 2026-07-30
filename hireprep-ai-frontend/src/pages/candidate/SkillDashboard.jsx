import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const SkillDashboard = () => {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    fetchSkillProfile();

  }, []);

  const fetchSkillProfile = async () => {

    try {

      setLoading(true);

      // ⚠️ UNVERIFIED ENDPOINT: "/skills/profile" is not in the locked API list — confirm before shipping
      const response = await api.get("/skills/profile");

      if (response.data.success) {

        setProfile(response.data.skillProfile);

      }

    }
    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to load skill profile."

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

          Loading Skill Dashboard...

        </h2>

      </div>

    );

  }

  if (!profile) {

    return (

      <div className="min-h-screen bg-[#05070f] p-6 text-[#f87171]">

        {error}

      </div>

    );

  }
  return (
    <div className="min-h-screen bg-[#05070f] max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8 text-white">
        Skill Dashboard
      </h1>

      {profile.skills.length === 0 ? (

        <div className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6">

          <h2 className="text-xl font-semibold text-white">
            No Skill Profile Found
          </h2>

          <p className="mt-3 text-gray-400">
            Complete resume analysis and interviews to build your skill profile.
          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {profile.skills.map((skill, index) => (

            <div
              key={index}
              className="bg-[#060a12] border border-[#091520] rounded-lg shadow-lg p-6"
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-semibold text-white">

                  {skill.skillName}

                </h2>

                <span className="text-cyan-400 font-bold text-xl">

                  {skill.confidence}%

                </span>

              </div>

              {/* Progress Bar */}

              <div className="w-full bg-[#091520] rounded-full h-3 mb-6">

                <div
                  className="bg-cyan-500 h-3 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  style={{
                    width: `${skill.confidence}%`
                  }}
                ></div>

              </div>

              {/* Strengths */}

              <div className="mb-6">

                <h3 className="font-semibold text-[#34d399] mb-3">

                  Strengths

                </h3>

                {skill.strengths.length > 0 ? (

                  <div className="flex flex-wrap gap-2">

                    {skill.strengths.map((item, i) => (

                      <span
                        key={i}
                        className="bg-[#34d399]/10 border border-[#34d399]/30 text-[#34d399] px-3 py-1 rounded-full"
                      >
                        {item}
                      </span>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-500">No strengths identified.</p>

                )}

              </div>

              {/* Weaknesses */}

              <div>

                <h3 className="font-semibold text-[#f87171] mb-3">

                  Weaknesses

                </h3>

                {skill.weaknesses.length > 0 ? (

                  <div className="flex flex-wrap gap-2">

                    {skill.weaknesses.map((item, i) => (

                      <span
                        key={i}
                        className="bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171] px-3 py-1 rounded-full"
                      >
                        {item}
                      </span>

                    ))}

                  </div>

                ) : (

                  <p className="text-gray-500">No weaknesses identified.</p>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Back Button */}

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

export default SkillDashboard;