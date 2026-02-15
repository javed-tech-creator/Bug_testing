import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/Footer";
import PrHeader from "../components/home/PrHeader";
import PrSidebar from "../components/home/PrSidebar";
export default function PrLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
        <PrHeader />
      </div>

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="z-50">
          <PrSidebar />
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
