import { Outlet } from "react-router-dom";
import CandidateSidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const CandidateLayout = () => {
    return (
        <div className="flex h-screen bg-[#05070f] text-white overflow-hidden">

            {/* Sidebar */}
            <CandidateSidebar />

            {/* Main Section */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Top Navigation */}
                <Navbar />

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-[#05070f]">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default CandidateLayout;