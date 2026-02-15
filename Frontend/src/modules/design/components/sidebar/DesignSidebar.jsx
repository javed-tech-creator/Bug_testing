import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/dss_logo.webp";
import * as Icons from "lucide-react";
import { FiBriefcase, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from "react-redux";

const DesignSidebar = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(""); // submenu
  const navigate = useNavigate();
  const roleSidebarItems = {
    manager: [
      {
        name: "Dashboard",
        icon: <MdSpaceDashboard size={20} />,
        link: "/design/dashboard",
      },
      {
        name: "Planning",
        icon: <Icons.CalendarCheck size={20} />, // planning // scheduling
        children: [
          {
            name: "Upcoming Designs",
            link: "/design/manager/designs/upcoming",
          },
          {
            name: "Next Day Planning Designs",
            link: "/design/manager/designs/next-day-planning",
          },
        ],
      },

      // {
      //   name: "Incoming Designs",
      //   icon: <Icons.ArrowDownToLine size={20} />, // planning // scheduling
      //   children: [
      //     {
      //       name: "Received Designs",
      //       link: "/design/manager/designs/received",
      //     },
      //     {
      //       name: "Assigned Designs",
      //       link: "/design/manager/designs/assigned",
      //     },
      //   ],
      // },

      {
        name: "Designs",
        icon: <Icons.PenTool size={20} />, // design related icon
        children: [
          {
            name: "Today Designs",
            link: "/design/manager/designs/today",
          },
          {
            name: "Recce In Designs",
            link: "/design/manager/designs/recce-in-design",
          },
          {
            name: "Received Designs",
            link: "/design/manager/designs/received",
          },
          {
            name: "Assigned Designs",
            link: "/design/manager/designs/assigned",
          },
          {
            name: "Flag Raised Designs",
            link: "/design/manager/designs/flag-raised",
          },
          {
            name: "Declined Designs",
            link: "/design/manager/designs/declined",
          },
          { name: "Waiting Designs", link: "/design/manager/designs/waiting" },
          { name: "Lost Designs", link: "/design/manager/designs/lost" },
        ],
      },

      // {
      //   name: "Design Workflow",
      //   icon: <Icons.GitBranch size={20} />, // workflow / process
      //   // link: "/design/manager/designs/workflow",
      //   children: [
      //     {
      //       name: "Designs Options",
      //       link: "/design/manager/designs/workflow",
      //     },
      //     {
      //       name: "Designs Option Version",
      //       // link: "/design/manager/designs/workflow/view",
      //       link: "#",
      //     },
      //   ],
      // },

      // {
      //   name: "Design Mockup",
      //   icon: <Icons.Image size={20} />, // mockup / preview
      //   link: "/design/manager/designs/mockup",
      //   // children: [
      //   //   {
      //   //     name: "Upload Mockup",
      //   //     link: "/design/executive/designs/mockup/upload",
      //   //   },
      //   //   {
      //   //     name: "View Mockup",
      //   //     link: "/design/executive/designs/mockup/view",
      //   //   },
      //   // ],
      // },

      {
        name: "Design Workflow",
        icon: <Icons.GitBranch size={20} />, // workflow / process
        children: [
          {
            name: "Upload Designs",
            link: "/design/manager/designs/workflow/upload",
          },
          {
            name: "View Designs",
            link: "/design/manager/designs/workflow/view",
          },
          {
            name: "Options For Approval",
            link: "/design/manager/designs/workflow/options",
          },
          {
            name: "Versions For Approval",
            link: "/design/manager/designs/workflow/versions",
          },
        ],
      },

      {
        name: "Design Mockup",
        icon: <Icons.Image size={20} />, // mockup / preview
        children: [
          {
            name: "Upload Mockup",
            link: "/design/manager/designs/mockup/upload",
          },
          {
            name: "View Mockup",
            link: "/design/manager/designs/mockup/view",
          },
          {
            name: "Version For Approval",
            link: "/design/manager/designs/mockup/version",
          },
        ],
      },

      {
        name: "Design Measurement For Quotation",
        icon: <Icons.FileText size={20} />, // quotation / document
        children: [
          {
            name: "Create Measurment",
            link: "/design/manager/designs/measurement-quotation/create",
          },
          {
            name: "View Measurment",
            link: "/design/manager/designs/measurement-quotation/view",
          },
          {
            name: "Measurment For Approval",
            link: "/design/manager/designs/measurement-quotation/approval",
          },
        ],
      },

      {
        name: "Design Reviews",
        icon: <Icons.ClipboardCheck size={20} />,
        link: "/design/manager/designs/reviews",
      },
      {
        name: "Design In Quotation",
        icon: <Icons.Receipt size={20} />,
        link: "/design/manager/designs/quotation",
      },
      {
        name: "Daily Reporting",
        icon: <Icons.ClipboardList size={20} />, // daily report / checklist
        children: [
          {
            name: "Morning Reporting",
            link: "/design/manager/designs/reporting/morning",
          },
          {
            name: "Evening Reporting",
            link: "/design/manager/designs/reporting/evening",
          },
        ],
      },

      {
        name: "Team Management",
        icon: <Icons.Users size={20} />,
        link: "/design/manager/designs/all-executives",
      },
      // {
      //   name: "Recommendation",
      //   icon: <Icons.Lightbulb size={20} />,
      //   link: "/design/manager/designs/recommendation",
      // },
      // {
      //   name: "Overall product",
      //   icon: <Icons.LayoutDashboard size={20} />,
      //   link: "/design/manager/designs/overall-product",
      // },
    ],
    executive: [
      {
        name: "Dashboard",
        icon: <MdSpaceDashboard size={20} />,
        link: "/design/dashboard",
      },
      {
        name: "Planning",
        icon: <Icons.CalendarCheck size={20} />, // planning / scheduling
        children: [
          {
            name: "Upcoming Designs",
            link: "/design/executive/designs/upcoming",
          },
          {
            name: "Next Day Planning Designs",
            link: "/design/executive/designs/next-day-planning",
          },
        ],
      },

      {
        name: "My Designs",
        icon: <Icons.PenTool size={20} />, // design related icon
        children: [
          {
            name: "Today Designs",
            link: "/design/executive/designs/today",
          },
          {
            name: "Assigned Designs",
            link: "/design/executive/designs/assigned",
          },
          {
            name: "Received Designs",
            link: "/design/executive/designs/received",
          },
          {
            name: "Flag Raised Designs",
            link: "/design/executive/designs/flag-raised",
          },
          {
            name: "Declined Designs",
            link: "/design/executive/designs/declined",
          },

          {
            name: "Waiting Designs",
            link: "/design/executive/designs/waiting",
          },
          { name: "Lost Designs", link: "/design/executive/designs/lost" },
        ],
      },

      {
        name: "Design Workflow",
        icon: <Icons.GitBranch size={20} />, // workflow / process
        children: [
          {
            name: "Upload Designs",
            link: "/design/executive/designs/workflow/upload",
          },
          {
            name: "View Designs",
            link: "/design/executive/designs/workflow/view",
          },
        ],
      },

      {
        name: "Design Mockup",
        icon: <Icons.Image size={20} />, // mockup / preview
        children: [
          {
            name: "Upload Mockup",
            link: "/design/executive/designs/mockup/upload",
          },
          {
            name: "View Mockup",
            link: "/design/executive/designs/mockup/view",
          },
        ],
      },

      {
        name: "Design Measurement For Quotation",
        icon: <Icons.FileText size={20} />, // quotation / document
        children: [
          {
            name: "Create Measurment",
            link: "/design/executive/designs/measurement-quotation/create",
          },
          {
            name: "View Measurment",
            link: "/design/executive/designs/measurement-quotation/view",
          },
        ],
      },
      {
        name: "Design Reviews",
        icon: <Icons.ClipboardCheck size={20} />,
        link: "/design/executive/designs/reviews",
      },

      {
        name: "Daily Reporting",
        icon: <Icons.ClipboardList size={20} />, // daily report / checklist
        children: [
          {
            name: "Morning Reporting",
            link: "/design/executive/designs/reporting/morning",
          },
          {
            name: "Evening Reporting",
            link: "/design/executive/designs/reporting/evening",
          },
        ],
      },
      // {
      //   name: "Recommendation",
      //   icon: <Icons.Lightbulb size={20} />,
      //   link: "/design/executive/designs/recommendation",
      // },
      // {
      //   name: "Overall product",
      //   icon: <Icons.LayoutDashboard size={20} />,
      //   link: "/design/executive/designs/overall-product",
      // },
    ],
  };

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;
  console.log("userData", userData);

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/design/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();
  console.log("userRole", userRole);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Default sidebar items (fallback)
  let sidebarItems = [];

  if (userRole === "executive") {
    sidebarItems = roleSidebarItems["executive"];
  } else if (userRole === "manager" || userRole === "manager") {
    sidebarItems = roleSidebarItems["manager"];
  } else {
    // agar koi unknown role hai to empty
    sidebarItems = [];
  }

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
      className={`${
        sidebarOpen
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
        {sidebarItems.map((item, index) => {
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
                className={`flex items-center justify-between w-full p-2 rounded-md transition-all duration-200 ${
                  isSelected
                    ? "text-white bg-neutral-800"
                    : "text-gray-300 hover:text-white hover:bg-neutral-800/50"
                }`}
                title={!sidebarOpen ? item.name : ""}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="flex-shrink-0 text-lg">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="text-sm font-medium break-words text-start max-w-full">
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
                        className={`block w-full text-left text-sm p-1 rounded-sm transition-colors duration-200 ${
                          currentPage === sub.name
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

export default DesignSidebar;
