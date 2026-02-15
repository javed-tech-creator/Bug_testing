import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/dss_logo.webp";
import * as Icons from "lucide-react";
import {
  FiUsers,
  FiBriefcase,
  FiChevronDown,
  FiChevronRight,
  FiBox,
  FiUserCheck,
} from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";

const ClientSidebar = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(""); // submenu
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      icon: <MdSpaceDashboard size={20} />,
      link: "/client/dashboard",
    },
    // {
    //   name: "Department Management",
    //   icon: <FiBriefcase size={20} />,
    //   children: [
    //     { name: "Location Hierarchy", link: "/client/location-hierarchy" },
    //     {
    //       name: "Department & Designation",
    //       link: "/client/department-designation",
    //     },
    //   ],
    // },
    // {
    //  {
    //   name: "Notifications",
    //   icon: <Icons.Bell  size={20} />,
    //   link: "/client/notification",
    // },
    {
      name: "Projects",
      icon: <Icons.List size={20} />,
      link: "/client/project-list",
    },

    {
      name: "Payment",
      icon: <Icons.IndianRupee size={20} />,
      link: "/client/payments",
    },

    {
      name: "Documents",
      icon: <Icons.Files size={20} />,
      link: "/client/documents",
    },

    {
      name: "Discussions",
      icon: <Icons.Handshake size={20} />,
      link: "/client/discussions",
    },

    {
      name: "Raised Concern",
      icon: <Icons.Slack size={20} />,
      link: "/client/raised-concern",
    },

    {
      name: "Access & Controls",
      icon: <Icons.ScanFace size={20} />,
      link: "/client/access-controls",
    },

    

  ];

  const handleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleItemClick = (item) => {
    if (item.children) {
      setOpenMenu(openMenu === item.name ? "" : item.name);
    } else {
      setCurrentPage(item.name);
      navigate(item.link);
    }
  };

  const handleSubItemClick = (subItem) => {
    setCurrentPage(subItem.name);
    navigate(subItem.link);
  };

  return (
    <div
      className={`${sidebarOpen
          ? "w-64"
          : "w-16 tracking-wider flex flex-col justify-center items-center"
        } bg-black h-screen ease-in-out shadow-2xl flex flex-col  `}
    >
      {/* Header */}
      <div className="p-1 border-b border-gray-200/20">
        <div className="flex items-center justify-between h-18">
          <div className={`${sidebarOpen ? "block" : "hidden"}  items-center`}>
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
      <nav className="flex-1 p-2 overflow-y-auto space-y-1">
        {navItems.map((item, index) => {
          const isActive = openMenu === item.name;
          const isSelected =
            currentPage === item.name ||
            (item.children &&
              item.children.some((sub) => sub.name === currentPage));

          return (
            <div key={index} className="relative w-full">
              {/* Main Item */}
              <button
                onClick={() => handleItemClick(item)}
                className={`flex items-center justify-between w-full p-2 rounded-md transition-all duration-200 ${isSelected
                    ? "text-white bg-neutral-800"
                    : "text-gray-300 hover:text-white hover:bg-neutral-800/50"
                  }`}
                title={!sidebarOpen ? item.name : ""}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="flex-shrink-0 text-lg">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="text-sm font-medium truncate">
                      {item.name}
                    </span>
                  )}
                </div>

                {sidebarOpen && item.children && item.children.length > 0 && (
                  <span className="flex-shrink-0">
                    {isActive ? (
                      <FiChevronDown size={16} />
                    ) : (
                      <FiChevronRight size={16} />
                    )}
                  </span>
                )}
              </button>

              {/* Submenu */}
              {item.children &&
                item.children.length > 0 &&
                isActive &&
                sidebarOpen && (
                  <div className="ml-6 border-l border-gray-700 pl-3 mt-1">
                    {item.children.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => handleSubItemClick(sub)}
                        className={`block w-full text-left text-sm p-1 rounded-sm transition-colors duration-200 ${currentPage === sub.name
                            ? "text-white bg-neutral-800"
                            : "text-gray-400 hover:text-white hover:bg-neutral-700"
                          }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default ClientSidebar;
