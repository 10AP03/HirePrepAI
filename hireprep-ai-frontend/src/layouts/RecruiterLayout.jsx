import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";

const RecruiterLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#05070f] overflow-hidden">

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <RecruiterSidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">

        <div className="lg:hidden flex items-center gap-4 px-4 py-3 bg-[#060a12] border-b border-[#091520] sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-cyan-400 text-xl p-1"
          >
            <FaBars />
          </button>
          <h1 className="text-white font-semibold text-sm">HirePrep AI</h1>
        </div>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default RecruiterLayout;