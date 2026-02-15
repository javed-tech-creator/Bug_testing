import React from 'react'
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import DesignNavbar from '../components/navbar/DesignNavbar';
import DesignSidebar from '../components/sidebar/DesignSidebar';


const DesignLayouts = () => {
   return (
    <div className="flex flex-col min-h-screen">

  <div className="">
        <DesignNavbar />
      </div>

  <div className="flex flex-1 overflow-hidden">
       <aside className="z-50">
      <DesignSidebar />
</aside>

  <main className="flex-1 py-20 overflow-y-auto h-screen bg-gray-50 p-0">
          <Outlet />
        </main>
       <div className="fixed bottom-0 z-10">
          <Footer/>
        </div>
      </div>
    </div>
  );
}

export default DesignLayouts
