import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaBell, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const RecruiterNavbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="h-16 bg-[#060a12] border-b border-[#091520] flex items-center justify-between px-8">

            {/* Left Section */}
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full border border-[#06b6d4] flex items-center justify-center"
                    style={{ boxShadow: "0 0 10px #06b6d435" }}
                >
                    <div
                        className="w-2 h-2 rounded-full bg-[#34d399]"
                        style={{ boxShadow: "0 0 6px #34d399" }}
                    ></div>
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-[#eef6ff]">
                        Welcome back, {user?.name || "Recruiter"} 👋
                    </h1>
                    <p className="text-xs text-[#2d4a62]">
                        AI evaluator is online and ready
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                {/* Notification */}
                <button className="relative p-2 rounded-lg bg-[#05070f] border border-[#091520] hover:border-[#06b6d435] transition duration-200">
                    <FaBell className="text-lg text-[#2d4a62]" />
                    <span
                        className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#f87171]"
                        style={{ boxShadow: "0 0 6px #f87171" }}
                    ></span>
                </button>

                {/* User */}
                <div className="flex items-center gap-3 bg-[#05070f] border border-[#091520] px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#051825] border border-[#06b6d4] flex items-center justify-center text-[#22d3ee] text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || "R"}
                    </div>
                    <div className="text-left">
                        <p className="text-[#c0d8ea] text-sm font-medium">
                            {user?.name || "Recruiter"}
                        </p>
                        <p className="text-xs text-[#1e3348]">
                            {user?.role || "Recruiter"}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#05070f] border border-[#091520] text-[#2d4a62] hover:bg-[#1a0505] hover:text-[#f87171] hover:border-[#f8717125] transition duration-200 text-sm"
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>

        </header>
    );
};

export default RecruiterNavbar;