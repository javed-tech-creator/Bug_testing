import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Rocket,
  Users,
  Clock,
  ChevronDown,
  ChevronRight,
  Trophy,
  BookOpen,
  ClipboardList,
  Building2,
  IndianRupee,
  AlertCircle,
  XCircle,
  Flag,
  FileX
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/dss_logo.webp";
import * as Icons from "lucide-react";
import { useSelector } from "react-redux";
import { MdSpaceDashboard } from "react-icons/md";
import { FiBriefcase, FiChevronDown, FiChevronRight } from "react-icons/fi";

const ProjectSidebar = () => {
  const [expandedNav, setExpandedNav] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(""); // submenu
  const navigate = useNavigate();


  const roleSidebarItems = {
    manager: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        url: "/project/dashboard",
      },
      {
        name: "Department Overview",
        icon: <Building2 size={20} />,
        url: "/project/manager/department",
      },
      {
        name: "Sales Intake",
        icon: <IndianRupee size={20} />,
        url: "/project/manager/sales-intake",
      },
      {
        name: "Assigned Projects",
        icon: <ClipboardList size={20} />,
        url: "/project/manager/assigned-projects"
      },
      {
        name: "Next Day Planning",
        icon: <Clock size={20} />,
        children: [
          { name: "Recce", url: "/project/manager/recce", icon: <Rocket size={16} /> },
          { name: "Design", url: "/project/manager/design", icon: <BookOpen size={16} /> },
          { name: "Quotation", url: "/project/manager/quotation", icon: <IndianRupee size={16} /> },
          { name: "PR", url: "/project/manager/pr", icon: <UserPlus size={16} /> },
          { name: "Production", url: "/project/manager/production", icon: <ClipboardList size={16} /> },
          { name: "Installation", url: "/project/manager/installation", icon: <Users size={16} /> },
          { name: "Dispatch", url: "/project/manager/dispatch", icon: <Rocket size={16} /> },
          { name: "Complaint", url: "/project/manager/complaint", icon: <Trophy size={16} /> },
          { name: "Repair", url: "/project/manager/repair", icon: <BookOpen size={16} /> },
        ]
      },
      {
        name: "Flag Raised/Issues",
        icon: <Flag size={20} />,
        url: "/project/manager/flag-raised"
      },
      {
        name: "Waiting Works",
        icon: <Clock size={20} />,
        url: "/project/waiting-works"
      },
      {
        name: "Lost Projects",
        icon: <FileX size={20} />,
        url: "/project/lost-projects"
      },
      {
        name: "Co-Ordinator's",
        icon: <Users size={20} />,
        url:"/project/co-ordinator"
      },
    ],
    coordinator: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        url: "/project/dashboard",
      },
      {
        name: "Department Overview",
        icon: <Building2 size={20} />,
        url: "/project/department-overview",
      },
      {
        name: "Assigned Projects",
        icon: <Rocket size={20} />,
        url: "/project/assigned-projects",
      },
      {
        name: "Next Day Planning",
        icon: <Clock size={20} />,
        children: [
          { name: "Recce", url: "/project/next-day/recce", icon: <Rocket size={16} /> },
          { name: "Design", url: "/project/next-day/design", icon: <IndianRupee size={16} /> },
          { name: "Quotation", url: "/project/next-day/quotation", icon: <UserPlus size={16} /> },
          { name: "PR", url: "/project/next-day/pr", icon: <ClipboardList size={16} /> },
          { name: "Production", url: "/project/next-day/production", icon: <Users size={16} /> },
          { name: "Installation", url: "/project/next-day/installation", icon: <Rocket size={16} /> },
          { name: "Dispatch", url: "/project/next-day/dispatch", icon: <Trophy size={16} /> },
          { name: "Complaint", url: "/project/next-day/complaint", icon: <BookOpen size={16} /> },
          { name: "Repair", url: "/project/next-day/repair", icon: <BookOpen size={16} /> },
        ],
      },
      {
        name: "Flag Raised / Issues",
        icon: <AlertCircle size={20} />,
        url: "/project/flag-raised",
      },
      {
        name: "Waiting Works",
        icon: <Clock size={20} />,
        url: "/project/waiting-works",
      },
      {
        name: "Lost Projects",
        icon: <XCircle size={20} />,
        url: "/project/lost-projects",
      },
    ],

  };

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;
  console.log("userData", userData);

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/project/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();
  console.log("userRole", userRole);

  // Default sidebar items (fallback)
  let sidebarItems = [];

  if (userRole === "coordinator") {
    sidebarItems = roleSidebarItems["coordinator"];
  } else if (userRole === "manager" || userRole === "manager") {
    sidebarItems = roleSidebarItems["manager"];
  } else {
    // agar koi unknown role hai to empty
    sidebarItems = [];
  }


  // -----pre

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleItemClick = (item) => {
    navigateTo(item.name);
    if (item.url) {
      navigate(item.url);
    }
    if (item.children && item.children.length > 0) {
      setSidebarOpen(true);
      toggleNav(item.name);
    }
    console.log(`Navigating to: ${item.url}`);
  };


  const toggleNav = (name) => {
    if (sidebarOpen && expandedNav === name) {
      setExpandedNav(null);
    } else {
      setExpandedNav(name);
    }
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
      <nav className="flex-1 p-1 overflow-y-auto  space-y-1">
        {sidebarItems.map((item, index) => {
          const isActive = expandedNav === item.name;

          return (
            <div key={index} className="relative">
              {item.children && item.children.length > 0 ? (
                <>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center text-gray-300 hover:text-white justify-between p-1.5 rounded-sm transition-all duration-200 group ${currentPage === item.name
                      ? "text-white bg-neutral-800"
                      : ""
                      }`}
                    title={!sidebarOpen ? item.name : ""}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{item.icon}</span>
                      {sidebarOpen && (
                        <span className="text-sm font-medium">{item.name}</span>
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
                        // <button
                        //   key={idx}
                        //   onClick={() => handleChildClick(child)}
                        //   className={`
                        //     block text-sm p-1 rounded-sm transition-colors duration-200 w-full text-left
                        //     ${currentPage === child.name
                        //       ? "text-white bg-neutral-800"
                        //       : "text-gray-400 hover:text-white"
                        //     }
                        //   `}
                        // >
                        //   {child.name}
                        // </button>

                        <button
                          key={idx}
                          onClick={() => handleChildClick(child)}
                          className={`
                            flex items-center gap-3 text-sm p-1 rounded-sm transition-colors duration-200 w-full text-left
                            ${currentPage === child.name
                              ? "text-white bg-neutral-800"
                              : "text-gray-400 hover:text-white"
                            }
                          `}
                        >
                          {child.icon && <span className="flex-shrink-0">{child.icon}</span>}
                          {sidebarOpen && <span>{child.name}</span>}
                        </button>


                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center gap-3 p-1.5 rounded-sm transition-all duration-200 group
                    ${currentPage === item.name
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

export default ProjectSidebar;
