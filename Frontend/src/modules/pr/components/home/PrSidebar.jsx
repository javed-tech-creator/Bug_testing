import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/dss_logo.webp";
import * as Icons from "lucide-react";
import { useSelector } from "react-redux";
import { MdSpaceDashboard } from "react-icons/md";
import { ChevronDown, ChevronRight } from "lucide-react";

const PrSidebar = () => {
  const [expandedNav, setExpandedNav] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();


  const roleSidebarItems = {
  executive: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/pr/dashboard",
    },
    {
      key: "planning",
      title: "Planning",
      icon: "CalendarClock",
      children: [
        {
          title: "Upcoming PR",
          path: "/pr/upcoming-pr",
        },
        {
          title: "Next Day Planning",
          path: "/pr/next-pr",
        },
      ],
    },
    {
      key: "my-pr",
      title: "My PR",
      icon: "ClipboardList",
      children: [
        { title: "Today's PR", path: "/pr/todays-pr" },
        {
          title: "Assigned PR",
          path: "/pr/assigned-pr",
        },
        { title: "Received PR", path: "/pr/received" },
        { title: "Flag Raised PR", path: "/pr/flag-raised" },
        { title: "Declined PR", path: "/pr/declined" },
        { title: "Waiting PR", path: "/pr/waiting" },
        { title: "Lost PR", path: "/pr/lost" },
      ],
    },
    {
      key: "quotations-in-review",
      title: "Quotations in Review",
      icon: "ShieldCheck",
      path: "/pr/review",
    },
    {
      key: "quotations-client",
      title: "Quotations (Client)",
      icon: "Users",
      path: "/pr/table",
    },
    {
      key: "report",
      title: "Daily Report",
      icon: "FileBarChart",
      children: [
        { title: "Morning Report", path: "/pr/morning-report" },
        { title: "Evening Report", path: "/pr/evening-report" },
      ],
    },
  ],

  manager: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/pr/dashboard",
    },
    {
      key: "planning",
      title: "Planning",
      icon: "CalendarClock",
      children: [
        {
          title: "Upcoming PR",
          path: "/pr/upcoming-pr",
        },
        {
          title: "Next Day Planning",
          path: "/pr/next-pr",
        },
      ],
    },
    {
      key: "my-pr",
      title: "My PR",
      icon: "ClipboardList",
      children: [
        {
          title: "Design In PR",
          path: "/pr/design-in-pr",
        },
        { title: "Today's PR", path: "/pr/todays-pr" },
        {
          title: "Assigned PR",
          path: "/pr/assigned-pr",
        },
        { title: "Received PR", path: "/pr/received" },

        { title: "Flag Raised PR", path: "/pr/flag-raised" },
        { title: "Declined PR", path: "/pr/declined" },
        { title: "Waiting PR", path: "/pr/waiting" },
        { title: "Lost PR", path: "/pr/lost" },
      ],
    },
    {
      key: "pr-in-review",
      title: "PR in Review",
      icon: "ShieldCheck",
      path: "/pr/review",
    },
    // {
    //   key: "pr-client",
    //   title: "PR (Client)",
    //   icon: "Briefcase",
    //   path: "/pr/table",
    // },
    {
      key: "pr-team-management",
      title: "Team Management",
      icon: "UserCog",
      path: "/pr/team-management",
    },

    {
      key: "report",
      title: "Daily Report",
      icon: "FileBarChart",
      children: [
        { title: "Morning Report", path: "/pr/morning-pr-manager" },
        { title: "Evening Report", path: "/pr/evening-pr-manager" },
      ],
    },
  ],
};

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;
  console.log("userData", userData);

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/pr/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();
  console.log("userRole", userRole);

  // Default sidebar items (fallback)
  let sidebarItems = [];
  if (userRole === "executive" || userRole === "pr executive") {
    sidebarItems = roleSidebarItems["executive"];
  } else if (userRole === "manager" || userRole === "manager") {
    sidebarItems = roleSidebarItems["manager"];
  } else if (userRole && roleSidebarItems[userRole]) {
    sidebarItems = roleSidebarItems[userRole];
  } else {
    sidebarItems = [];
  }

  // Ensure sidebarItems is always an array
  sidebarItems = Array.isArray(sidebarItems) ? sidebarItems : [];

  // Helper function to get icon component from string name
  const getIconComponent = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleItemClick = (item) => {
    navigateTo(item.title);
    if (item.path) {
      navigate(item.path);
    }
    if (item.children && item.children.length > 0) {
      setSidebarOpen(true);
      toggleNav(item.key);
    }
    console.log(`Navigating to: ${item.path}`);
  };


  const toggleNav = (key) => {
    if (sidebarOpen && expandedNav === key) {
      setExpandedNav(null);
    } else {
      setExpandedNav(key);
    }
  };


  const handleChildClick = (child) => {
    navigateTo(child.title);
    navigate(`${child.path}`);
    console.log(`Navigating to: ${child.path}`);
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
        {(sidebarItems || []).map((item, index) => {
          const isActive = expandedNav === item.key;

          return (
            <div key={index} className="relative">
              {item.children && item.children.length > 0 ? (
                <>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center text-gray-300 hover:text-white justify-between p-1.5 rounded-sm transition-all duration-200 group ${currentPage === item.title
                      ? "text-white bg-neutral-800"
                      : ""
                      }`}
                    title={!sidebarOpen ? item.title : ""}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{getIconComponent(item.icon)}</span>
                      {sidebarOpen && (
                        <span className="text-sm font-medium">{item.title}</span>
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
                            ${currentPage === child.title
                              ? "text-white bg-neutral-800"
                              : "text-gray-400 hover:text-white"
                            }
                          `}
                        >
                          {child.title}
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
                    ${currentPage === item.title
                      ? "text-white bg-neutral-800"
                      : "text-gray-300 hover:text-white"
                    }
                  `}
                  title={!sidebarOpen ? item.title : ""}
                >
                  <span className="flex-shrink-0">{getIconComponent(item.icon)}</span>
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.title}</span>
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

export default PrSidebar;