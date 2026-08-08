import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    FaBrain,
    FaHome,
    FaUsers,
    FaTrophy,
    FaPlusCircle,
    FaSignOutAlt,
} from "react-icons/fa";

const RecruiterSidebar = ({ onNavigate }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        {
            name: "Dashboard",
            path: "/recruiter/dashboard",
            icon: <FaHome />,
        },
        {
            name: "Candidates",
            path: "/recruiter/candidates",
            icon: <FaUsers />,
        },
        {
            name: "Schedule Interview",
            path: "/recruiter/create-interview",
            icon: <FaPlusCircle />,
        },
    ];

    return (
        <aside className="w-56 h-screen bg-[#060a12] border-r border-[#091520] flex flex-col">

            {/* Logo */}
            <div className="px-5 py-5 border-b border-[#091520]">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 bg-[#051018] border border-[#06b6d4] rounded-lg flex items-center justify-center"
                        style={{ boxShadow: "0 0 12px #06b6d435" }}
                    >
                        <FaBrain className="text-[#06b6d4] text-sm" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-[#eef6ff]">
                            HirePrep AI
                        </h1>
                        <p className="text-xs text-[#1a2d3f]">
                            Interview Intelligence
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">

                <p className="text-[#152030] text-xs uppercase tracking-widest px-3 py-2">
                    Recruiter
                </p>

                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => onNavigate?.()}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                            ${
                                isActive
                                    ? "bg-[#051825] text-[#22d3ee] border-l-2 border-[#06b6d4] pl-2.5"
                                    : "text-[#2d4a62] hover:bg-[#091520] hover:text-[#6ab8d0]"
                            }`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}

                <p className="text-[#152030] text-xs uppercase tracking-widest px-3 py-2 pt-4">
                    System
                </p>

                <NavLink
                    to="/recruiter/rankings"
                    onClick={() => onNavigate?.()}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                        ${
                            isActive
                                ? "bg-[#051825] text-[#22d3ee] border-l-2 border-[#06b6d4] pl-2.5"
                                : "text-[#2d4a62] hover:bg-[#091520] hover:text-[#6ab8d0]"
                        }`
                    }
                >
                    <span className="text-base"><FaTrophy /></span>
                    <span>Rankings</span>
                </NavLink>

            </nav>

            {/* Bottom Section */}
            <div className="p-3 border-t border-[#091520]">

                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#051825] border border-[#06b6d4] flex items-center justify-center text-[#22d3ee] text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || "R"}
                    </div>
                    <div>
                        <p className="text-[#c0d8ea] text-xs font-medium">
                            {user?.name || "Recruiter"}
                        </p>
                        <p className="text-[#1e3348] text-xs">
                            Recruiter panel
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#2d4a62] hover:bg-[#1a0505] hover:text-[#f87171] transition-all duration-200 text-sm"
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default RecruiterSidebar;