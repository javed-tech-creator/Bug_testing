import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/Footer";
import QuatationHeader from "../components/home/QuatationHeader.jsx";
import QuatationSidebar from "../components/home/QuatationSidebar.jsx";
export default function QuatationLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
        <QuatationHeader />
      </div>

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="z-50">
          <QuatationSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1  py-20 overflow-y-auto h-screen bg-gray-50 p-4">
          <Outlet />
        </main>
        <div className="fixed bottom-0 z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}
