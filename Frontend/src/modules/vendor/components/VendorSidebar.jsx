
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/dss_logo.webp";
import { MdAnalytics, MdCategory, MdSpaceDashboard } from "react-icons/md";
import { GiCardboardBox } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { RiFileList3Line } from "react-icons/ri";
import * as Icons from "lucide-react";

const Sidebar = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <MdSpaceDashboard />, link: "/vendor/dashboard" },
    { name: "Add Product Category", icon: <MdCategory />, link: "/vendor/category" },
    { name: "Product Management", icon: <GiCardboardBox />, link: "/vendor/product" },
    { name: "Purchase Orders", icon: <RiFileList3Line />, link: "/vendor/purchaseOrder" },
        { name: "Profile Management", icon: <CgProfile />, link: "/vendor/profile" }, 
{ name: "Analytics", icon: <MdAnalytics />, link: "/vendor/analytics" }
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

export default Sidebar;
