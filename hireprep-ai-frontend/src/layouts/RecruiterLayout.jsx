import { Outlet } from "react-router-dom";
import RecruiterNavbar from "../components/recruiter/RecruiterNavbar";
import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";

const RecruiterLayout = () => {
    return (
        <div className="flex h-screen bg-[#05070f] text-white overflow-hidden">

            <RecruiterSidebar />

            <div className="flex flex-col flex-1 overflow-hidden">

                <RecruiterNavbar />

                <main className="flex-1 overflow-y-auto p-6 bg-[#05070f]">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default RecruiterLayout;