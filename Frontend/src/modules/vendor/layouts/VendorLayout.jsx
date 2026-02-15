import { Outlet } from "react-router-dom";
import Sidebar from "../components/VendorSidebar";
import Navbar from "../components/VendorNavbar";
import Footer from "../components/Footer";




const VendorLayout = () => {

  return (
    <div className="flex flex-col min-h-screen">

  <div className="">
        <Navbar />
      </div>

  <div className="flex flex-1 overflow-hidden">
       <aside className="z-50">
      <Sidebar />
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
};

export default VendorLayout;
