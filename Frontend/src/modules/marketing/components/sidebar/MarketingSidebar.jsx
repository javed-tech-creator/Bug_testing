
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../../assets/dss_logo.webp";
import * as Icons from "lucide-react";
import { FiBarChart2, FiUsers, FiTrendingUp, FiShare2, FiFolder } from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";
const MarketingSidebar = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
       { name: "Dashboard", icon: <MdSpaceDashboard />, link: "/marketing/dashboard" },
     { name: "Campaign Management", icon: <FiBarChart2 />, link: "/marketing/campaigns" },
  { name: "Lead Generation", icon: <FiUsers />, link: "/marketing/lead-generation" },
  { name: "Analytics & ROI Tracking", icon: <FiTrendingUp />, link: "/marketing/analytics-roi-tracking" },
  { name: "Referral & Marketing", icon: <FiShare2 />, link: "/marketing/referrals" },
  { name: "Branding & Repository", icon: <FiFolder />, link: "/marketing/branding" },
  ];

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleItemClick = (item) => {
    setCurrentPage(item.name);
    navigate(item.link);
  };

  return (
   <div
      className={`${
        sidebarOpen
          ? "w-64"
          : "w-16 tracking-wider flex flex-col justify-center items-center"
      } bg-black h-screen ease-in-out shadow-2xl flex flex-col  `}
    >
      {/* Header */}
    <div className="p-1 border-b border-gray-200/20">
  <div className="flex items-center justify-between h-18">
 <div className={`${sidebarOpen ? "block":"hidden"}  items-center`}>
                   <img src={logo} alt="logo" className="h-18 w-36 bg-white" />
                 </div>

     <button
                 onClick={handleSidebar}
                 className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-200 hover:text-white"
               >
      <Icons.Menu size={20} />
    </button>
  </div>
</div>


   {/* Navigation */}
<nav className="flex-1 p-1 overflow-y-auto space-y-1 flex flex-col items-center">
  {navItems.map((item, index) => (
    <button
      key={index}
      onClick={() => handleItemClick(item)}
      className={` flex items-center ${
        sidebarOpen ? "justify-start gap-3 px-3 w-full" : "justify-center"
      } p-2 rounded-lg transition-all duration-200 group
        ${
          currentPage === item.name
            ? "text-white bg-neutral-800"
            : "text-gray-300 hover:text-white"
        }
      `}
      title={!sidebarOpen ? item.name : ""}
    >
      <span className="flex-shrink-0 text-xl">{item.icon}</span>
      {sidebarOpen && (
        <span className="text-sm font-medium">{item.name}</span>
      )}
    </button>
  ))}
</nav>

    </div>
  );
};

export default MarketingSidebar;
