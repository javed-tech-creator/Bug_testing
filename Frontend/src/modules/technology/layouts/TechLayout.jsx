import { Outlet } from "react-router-dom";
import Footer from "../../../components/Footer";
import TechHeader from "../components/TechHeader";
import TechSidebar from "../components/TechSidebar";

const TechLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
      <TechHeader />
      </div>

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="z-50">
          <TechSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1  py-20 overflow-y-auto h-screen bg-gray-50 p-4">
          <Outlet />
        </main>
        <div className="fixed bottom-0 z-10">
          <Footer/>
        </div>
      </div>
    </div>
  );
};

export default TechLayout;
