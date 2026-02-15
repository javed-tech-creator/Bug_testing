import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import RecceHeader from "../components/RecceHeader";
import RecceSidebar from "../components/RecceSidebar";
import Footer from "../../../components/Footer";

const RecceLayout = () => {
  const mainContentRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main content area to top
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
    // Also scroll window
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
      <RecceHeader />
      </div>

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="z-50">
          <RecceSidebar />
        </aside>

        {/* Main content area */}
        <main 
          ref={mainContentRef}
          className="flex-1  py-20 overflow-y-auto h-screen bg-gray-50 p-4"
        >
          <Outlet />
        </main>
        <div className="fixed bottom-0 z-10">
          <Footer/>
        </div>
      </div>
    </div>
  );
};

export default RecceLayout;
