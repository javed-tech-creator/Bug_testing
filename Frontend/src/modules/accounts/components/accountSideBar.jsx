import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  
  Rocket, 
 
  ChevronDown,
  ChevronRight,
  
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from "@/assets/dss_logo.webp";
import * as Icons from "lucide-react";

const AccountSidebar = () => {
  const [expandedNav, setExpandedNav] = useState(null);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const data = { role: "Admin" }; 
  const navigate = useNavigate()

 
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, children: [], url: "/account/dashboard" },
    // { name: 'Recruitment', icon: <UserPlus size={20} />, children: [], url: "/dashboard/recruitment" },
    { name: 'Quatation', icon: <Rocket size={20} />, chiledren:[],url:"/account/quatation" },
    { name: 'Account Invoice', icon: <Rocket size={20} />, chiledren:[],url:"/account/invoice" } ,
    // { name: 'Vendor & Contrator', icon: <Rocket size={20} />, chiledren:[],url:"/account/vendor" }, 
    // { name: 'Payables', icon: <Rocket size={20} />, chiledren:[],url:"/account/payable" },
    { name: 'Vendor', icon: <Rocket size={20} />, chiledren:[],url:"/account/Ven" },  
    { name: 'Payment', icon: <Rocket size={20} />, chiledren:[],url:"/account/taxpayment" },
    { name: ' Tax & Compliance', icon: <Rocket size={20} />, chiledren:[],url:"/account/Taxdeduct" },
    
    
  ];

  const filteredNavItems = data?.role === "Admin"
    ? navItems
    : navItems.filter(item => item.name !== "Employee" && item.name !== "Recruitment");

  const toggleNav = (name) => {
    if (sidebarOpen && expandedNav === name) {
      setExpandedNav(null);
    } else {
      setExpandedNav(name);
    }
  };

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleItemClick = (item) => {
    navigateTo(item.name);
    if (item.url) {
      navigate(item.url);
    }
    if (item?.children?.length > 0) {
      setSidebarOpen(true);
      toggleNav(item.name);
    }
    console.log(`Navigating to: ${item.url}`);
  };

  const handleChildClick = (child) => {
    navigateTo(child.name);
    navigate(`${child.url}`);
    console.log(`Navigating to: ${child.url}`);
  };

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (sidebarOpen) {
      setExpandedNav(null);
    }
  }

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
      <nav className="flex-1 p-1 overflow-y-auto  space-y-1">
        {filteredNavItems.map((item, index) => {
          const isActive = expandedNav === item.name;

          return (
            <div key={index} className="relative">
              {item.children && item.children.length > 0 ? (
                <>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center text-gray-300 hover:text-white justify-between p-1.5 rounded-sm transition-all duration-200 group ${
                      currentPage === item.name ? 'text-white bg-neutral-800' : ''
                    }`}
                    title={!sidebarOpen ? item.name : ""}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{item?.icon}</span>
                      {sidebarOpen && (
                        <span className="text-sm font-medium">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {sidebarOpen && (
                      <div className="transition-transform duration-200">
                        {isActive ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                    )}
                  </button>

                  {isActive && sidebarOpen && (
                    <div className="ml-4 border-l border-gray-700 pl-4">
                      {item.children.map((child, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChildClick(child)}
                          className={`
                            block text-sm p-1 rounded-sm transition-colors duration-200 w-full text-left
                            ${
                              currentPage === child.name
                                ? "text-white bg-neutral-800"
                                : "text-gray-400 hover:text-white"
                            }
                          `}
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center gap-3 p-1.5 rounded-lg transition-all duration-200 group
                    ${
                      currentPage === item.name
                        ? "text-white bg-neutral-800"
                        : "text-gray-300 hover:text-white"
                    }
                  `}
                  title={!sidebarOpen ? item.name : ""}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default AccountSidebar;