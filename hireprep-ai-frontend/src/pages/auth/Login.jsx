import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { FaBrain } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const res = await loginUser(formData);

            login(res.user, res.token);

            if (res.user.role === "candidate") {
                navigate("/candidate/dashboard");
            } else if (res.user.role === "recruiter") {
                navigate("/recruiter/dashboard");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#05070f]">

            {/* Glow orb background effect */}
            <div
                className="absolute w-96 h-96 rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, #06b6d415 0%, transparent 70%)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />

            <form
                onSubmit={handleSubmit}
                className="relative bg-[#060a12] border border-[#091520] rounded-2xl p-8 w-full max-w-md"
                style={{ boxShadow: "0 0 40px #06b6d415" }}
            >

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-12 h-12 bg-[#051018] border border-[#06b6d4] rounded-xl flex items-center justify-center mb-3"
                        style={{ boxShadow: "0 0 16px #06b6d440" }}
                    >
                        <FaBrain className="text-[#06b6d4] text-xl" />
                    </div>
                    <h1 className="text-xl font-semibold text-[#eef6ff]">
                        HirePrep AI
                    </h1>
                    <p className="text-xs text-[#2d4a62] mt-1">
                        Sign in to your account
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-[#1a0505] border border-[#f8717125] rounded-lg px-4 py-3 mb-5">
                        <p className="text-[#f87171] text-sm">
                            {error}
                        </p>
                    </div>
                )}

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-[#5a7a90] text-sm mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[#05070f] border border-[#091520] rounded-lg px-4 py-2.5
                        text-[#eef6ff] text-sm placeholder-[#1e3348]
                        focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d425]
                        transition duration-200"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-[#5a7a90] text-sm mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#05070f] border border-[#091520] rounded-lg px-4 py-2.5
                        text-[#eef6ff] text-sm placeholder-[#1e3348]
                        focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d425]
                        transition duration-200"
                        required
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg font-semibold text-sm transition duration-200
                    disabled:bg-[#0f1628] disabled:text-[#2d4a62] disabled:cursor-not-allowed
                    bg-[#06b6d4] hover:bg-[#22d3ee] text-[#020d14]"
                    style={{ boxShadow: loading ? "none" : "0 0 20px #06b6d450" }}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Register link */}
                <p className="mt-6 text-center text-sm text-[#2d4a62]">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-[#06b6d4] hover:text-[#22d3ee] transition duration-200"
                    >
                        Register
                    </Link>
                </p>

            </form>

        </div>
    );
};

export default Login;