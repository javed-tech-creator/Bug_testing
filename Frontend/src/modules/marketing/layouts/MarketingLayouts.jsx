import Footer from '@/components/Footer';
import React from 'react'
import { Outlet } from 'react-router-dom';
import MarketingNavbar from '../components/navbar/MarketingNavbar';
import MarketingSidebar from '../components/sidebar/MarketingSidebar';


const MarketingLayouts = () => {
   return (
    <div className="flex flex-col min-h-screen">

  <div className="">
        <MarketingNavbar />
      </div>

  <div className="flex flex-1 overflow-hidden">
       <aside className="z-50">
      <MarketingSidebar />
</aside>

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

export default MarketingLayouts