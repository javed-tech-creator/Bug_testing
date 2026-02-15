import React from 'react'
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import AdminNavbar from '../components/navbar/AdminNavbar';
import AdminSidebar from '../components/sidebar/AdminSidebar';


const AdminLayouts = () => {
   return (
    <div className="flex flex-col min-h-screen">

  <div className="">
        <AdminNavbar />
      </div>

  <div className="flex flex-1 overflow-hidden">
       <aside className="z-50">
      <AdminSidebar />
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

export default AdminLayouts