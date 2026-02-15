import React from 'react'
import HrSidebar from '../components/home/HrSidebar';
import { Outlet } from 'react-router-dom';
import Footer from '../../../components/Footer';
import HrHeader from '../components/home/HrHeader';

export default function HrLayout() {
   return (
    <div className="flex flex-col min-h-screen">
      <div className="">
      <HrHeader />
      </div>

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="z-50">
          <HrSidebar />
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
}
