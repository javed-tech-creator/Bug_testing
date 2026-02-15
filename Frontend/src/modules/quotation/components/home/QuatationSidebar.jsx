import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import logo from "../../../../assets/dss_logo.webp";
import { useSelector } from "react-redux";

const roleSidebarItems = {
  executive: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/quotation/dashboard",
    },
    {
      key: "planning",
      title: "Planning",
      icon: "CalendarClock",
      children: [
        {
          title: "Upcoming Quotations",
          path: "/quotation/upcoming-quotations",
        },
        {
          title: "Next Day Planning",
          path: "/quotation/next-quotations",
        },
      ],
    },
    {
      key: "my-quotations",
      title: "My Quotations",
      icon: "ClipboardList",
      children: [
        { title: "Today's Quotations", path: "/quotation/todays-quotations" },
        {
          title: "Assigned Quotations",
          path: "/quotation/assigned-quotations",
        },
        { title: "Received Quotations", path: "/quotation/received" },
        { title: "Flag Raised Quotations", path: "/quotation/flag-raised" },
        { title: "Declined Quotations", path: "/quotation/declined" },
        { title: "Waiting Quotations", path: "/quotation/waiting" },
        { title: "Lost Quotations", path: "/quotation/lost" },
      ],
    },
    {
      key: "quotations-in-review",
      title: "Quotations in Review",
      icon: "ShieldCheck",
      path: "/quotation/review",
    },
    {
      key: "quotations-client",
      title: "Quotations (Client)",
      icon: "Users",
      path: "/quotation/table",
    },
    {
      key: "report",
      title: "Daily Report",
      icon: "FileBarChart",
      children: [
        { title: "Morning Report", path: "/quotation/morning-report" },
        { title: "Evening Report", path: "/quotation/evening-report" },
      ],
    },
  ],

  manager: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/quotation/dashboard",
    },
    {
      key: "planning",
      title: "Planning",
      icon: "CalendarClock",
      children: [
        {
          title: "Upcoming Quotations",
          path: "/quotation/upcoming-quotations",
        },
        {
          title: "Next Day Planning",
          path: "/quotation/next-quotations",
        },
      ],
    },
    {
      key: "my-quotations",
      title: "My Quotations",
      icon: "ClipboardList",
      children: [
        {
          title: "Design In Quotation",
          path: "/quotation/design-in-quotation",
        },
        { title: "Today's Quotations", path: "/quotation/todays-quotations" },
        {
          title: "Assigned Quotations",
          path: "/quotation/assigned-quotations",
        },
        { title: "Received Quotations", path: "/quotation/received" },

        { title: "Flag Raised Quotations", path: "/quotation/flag-raised" },
        { title: "Declined Quotations", path: "/quotation/declined" },
        { title: "Waiting Quotations", path: "/quotation/waiting" },
        { title: "Lost Quotations", path: "/quotation/lost" },
      ],
    },
    {
      key: "quotations-in-review",
      title: "Quotations in Review",
      icon: "ShieldCheck",
      path: "/quotation/review",
    },
    {
      key: "quotations-client",
      title: "Quotations (Client)",
      icon: "Briefcase",
      path: "/quotation/table",
    },
    {
      key: "quotations-team-management",
      title: "Team Management",
      icon: "UserCog",
      path: "/quotation/team-management",
    },

    {
      key: "report",
      title: "Daily Report",
      icon: "FileBarChart",
      children: [
        { title: "Morning Report", path: "/quotation/morning-quotation-manager" },
        { title: "Evening Report", path: "/quotation/evening-quotation-manager" },
      ],
    },
  ],
};

const QuatationSidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDropdown = (key) => {
    if (isCollapsed) return;
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      setOpenDropdown(null);
    }
  };

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();

  const normalizedRole =
    {
      executive: "executive",
      "quotation executive": "executive",
      manager: "manager",
      "quotation manager": "manager",
      hod: "manager",
      "quotation hod": "manager",
    }[role] || "executive";

  const sidebarItems = roleSidebarItems[normalizedRole] || [];

  return (
    <div
      className={`${
        isCollapsed
          ? "w-16  tracking-wider flex flex-col justify-center items-center"
          : "w-64"
      } bg-black  h-screen ease-in-out shadow-2xl`}
    >
      {/* Header */}
      <div className="p-1 border-b border-gray-200/20  ">
        <div className="flex items-center justify-between h-18">
          {!isCollapsed && (
            <div className="flex items-center">
              <img src={logo} alt="logo" className="h-18 w-36 bg-white" />
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-200 hover:text-white"
          >
            <Icons.Menu size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-1 space-y-1 overflow-y-auto flex-1">
        {sidebarItems.map((item, index) => {
          const Icon = Icons[item.icon] || Icons.Circle;
          const isActive = openDropdown === item.key;

          return (
            <div key={index} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className={`w-full flex items-center text-gray-300  hover:text-white justify-between p-1.5 rounded-lg transition-all duration-200 group `}
                    title={isCollapsed ? item.title : ""}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <Icons.ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          isActive ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {isActive && !isCollapsed && (
                    <div className=" ml-4  border-l border-gray-700 pl-4">
                      {item.children.map((child, idx) => (
                        <NavLink
                          key={idx}
                          to={child.path}
                          className={({ isActive }) => `
                            block text-sm p-1 rounded-sm transition-colors duration-200
                            ${
                              isActive
                                ? "text-white bg-neutral-800"
                                : "text-gray-400 hover:text-white "
                            }
                          `}
                        >
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 p-1.5 rounded-lg transition-all duration-200 group
                    ${
                      isActive
                        ? "text-gray-300"
                        : "text-gray-300 hover: hover:text-white"
                    }
                  `}
                  title={isCollapsed ? item.title : ""}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default QuatationSidebar;
