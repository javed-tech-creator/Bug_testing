// import React from 'react'
// import { Outlet } from 'react-router-dom';
// import Footer from '@/components/Footer';
// import ClientNavbar from '../components/navbar/ClientNavbar';
// import ClientSidebar from '../components/sidebar/ClientSidebar';

// const ClientLayouts = () => {
//   return (
//     <div className="flex flex-col min-h-screen">

//       <div className="">
//         <ClientNavbar />
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <aside className="z-50">
//           <ClientSidebar />
//         </aside>

//         <main className="flex-1 py-20 overflow-y-auto h-screen bg-gray-50 p-0">
//           <Outlet />
//         </main>
//         <div className="fixed bottom-0 z-10">
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ClientLayouts

// import React from "react";
// import { Outlet } from "react-router-dom";
// import Footer from "@/components/Footer";
// import ClientNavbar from "../components/navbar/ClientNavbar";
// import ClientSidebar from "../components/sidebar/ClientSidebar";

// const ClientLayouts = () => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex flex-1 overflow-hidden">
//         <aside className="z-50">
//           <ClientSidebar />
//         </aside>

//         <main className="flex-1 relative py-20 h-screen p-0 bg-gray-100">
//           <div className="absolute w-full top-0 left-0 z-10">
//             <ClientNavbar />
//           </div>
//           <div className="flex-1 overflow-y-auto h-screen pb-[120px]">
//             <Outlet />
//           </div>
//           <div className="fixed bottom-0 z-10">
//             <Footer />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ClientLayouts;


import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../../components/Footer";
import ClientSidebar from "../components/sidebar/ClientSidebar";
import Clientheader from "../components/header/Clientheader";

export default function ProjectLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
        <Clientheader />
      </div>

      {/* Main content below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="z-50">
        
          <ClientSidebar />
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

