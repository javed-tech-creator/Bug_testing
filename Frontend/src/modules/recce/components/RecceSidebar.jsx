import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import logo from "../../../assets/dss_logo.webp";
import { useAuth } from "../../../store/AuthContext";
import { useSelector } from "react-redux";

const roleSidebarItems = {
  executive: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/recce/dashboard",
    },
    {
      key: "planning",
      title: "Planning",
      icon: "CalendarClock",
      children: [
        { title: "Upcoming Recce", path: "/recce/upcoming-recce" },
        {
          title: "Next Day Planning",
          path: "/recce/next-day-recce-planning",
        },
      ],
    },
    {
      key: "my-recce",
      title: "My Recce",
      icon: "ClipboardList",
      children: [
          { title: "Today's Recce", path: "/recce/todays-recce" },
         { title: "Assigned Recce", path: "/recce/assigned-executive-recce" },
        { title: "Received Recce", path: "/recce/received-recce" },
        { title: "Flag Raised Recce", path: "/recce/flag-raised-recce" },
        { title: "Declined Recce", path: "/recce/rejected-recce" },
        { title: "Waiting Recce", path: "/recce/waiting-recce" },
        { title: "Lost Recce", path: "/recce/lost-recce" },
      ],
    },
    {
      key: "recce-workflow",
      title: "Draft",
      icon: "GitBranch",
      path: "/recce/workings",
    },
    // {
    //   key: "recce-in-review-client",
    //   title: "Recce in Review (Client)",
    //   icon: "UserCheck",
    //   path: "/recce/recce-review-client",
    // },
    {
      key: "recce-in-review-manager",
      title: "Recce in Review (Manager)",
      icon: "ShieldCheck",
      path: "/recce/recce-review-manager",
    },
    {
      key: "report",
      title: "Daily Report",
      icon: "FileBarChart",
      children: [
        { title: "Morning Report", path: "/recce/morning-report" },
        { title: "Evening Report", path: "/recce/evening-report" },
      ],
    },
    {
      key: "recommendation",
      title: "Recommendation",
      icon: "ThumbsUp",
      path: "/recce/recommendation-table",
    },
  ],

  //   manager: [
  //     {
  //       key: "dashboard",
  //       title: "Dashboard",
  //       icon: "LayoutDashboard",
  //       path: "/recce/dashboard",
  //     },
  //     {
  //       key: "my-recces",
  //       title: "My Recce's",
  //       icon: "ListChecks",
  //       children: [
  //         { title: "New Recce", path: "/recce/total-recce" },
  //         { title: "Received Recce", path: "/recce/received-recce" },
  //         { title: "Assigned Recce", path: "/recce/assigned-recce" },
  //         { title: "Rejected Recce", path: "/recce/rejected-recce" },
  //         { title: "Flag Raised Recce", path: "/recce/flag-raised-recce" },
  //         { title: "Unassigned Recce", path: "/recce/unassigned-recce" },
  //         { title: "Waiting Recce", path: "/recce/waiting-recce" },
  //         { title: "Completed Recce", path: "/recce/completed-recce" },
  //       ],
  //     },
  //     {
  //       key: "planning",
  //       title: "Planning",
  //       icon: "Calendar",
  //       children: [
  //         {
  //           title: "Next Day Planning Recce",
  //           path: "/recce/next-day-recce-planning",
  //         },
  //         { title: "Planning Details", path: "/recce/recce-planning-detail" },
  //         { title: "Possible Recce", path: "/recce/possible-recce" },
  //       ],
  //     },
  //     {
  //       key: "recce-workflow",
  //       title: "Recce Workflow",
  //       icon: "GitBranch",
  //       children: [
  //         { title: "Recce Started", path: "/recce/recce-started" },
  //         { title: "Recce Drafts", path: "/recce/recce-drafts" },
  //         { title: "Recce Modification", path: "/recce/recce-modification" },
  //         { title: "Recce Approved", path: "/recce/recce-approved" },
  //       ],
  //     },

  //     {
  //       key: "recce-reporting",
  //       title: "Recce Reporting",
  //       icon: "FileText",
  //       children: [
  //         { title: "Recce Report", path: "/recce/recce-report" },
  //         { title: "Recce in Design", path: "/recce/recce-in-design" },
  //       ],
  //     },
  //     {
  //       key: "team-management",
  //       title: "Team Management",
  //       icon: "Users",
  //       path: "/recce/team",
  //     },
  //     {
  //       key: "daily-reporting",
  //       title: "Daily Reporting",
  //       icon: "CalendarDays",
  //       children: [
  //         { title: "Morning Report", path: "/recce/morning-report" },
  //         { title: "Evening Report", path: "/recce/evening-report" },
  //       ],
  //     },
  //     {
  //       key: "profile",
  //       title: "Profile",
  //       icon: "UserPen",
  //       path: "/recce/profilepage",
  //     },
  //   ],

  manager: [
    // {
    //   key: "dashboard",
    //   title: "Dashboard",
    //   icon: "LayoutDashboard",
    //   path: "/recce/dashboard",
    // },

    // {
    //   key: "planning-recce",
    //   title: "Planning Recce",
    //   icon: "CalendarClock",
    //   children: [
    //     { title: "Upcoming Recce", path: "/recce/upcoming-recce" },
    //     {
    //       title: "Next Day Planning Recce",
    //       path: "/recce/next-day-recce-planning",
    //     },
    //   ],
    // },

    // {
    //   key: "my-recce",
    //   title: "My Recce's",
    //   icon: "ClipboardList",
    //   children: [
    //     { title: "Received Recce", path: "/recce/received-recce" },
    //     { title: "Assigned Recce", path: "/recce/assigned-recce" },
    //     { title: "Flag Raised Recce", path: "/recce/flag-raised-recce" },
    //     { title: "Declined Recce", path: "/recce/lost-recce" },
    //     { title: "Waiting Recce", path: "/recce/waiting-recce" },
    //     { title: "Lost Recce", path: "/recce/lost-recce" },
    //   ],
    // },

    // {
    //   key: "recce-workflow",
    //   title: "Recce Workflow",
    //   icon: "GitBranch",
    //   children: [
    //     { title: "Upload Recce", path: "/recce/upload-recce" },
    //     { title: "View Recce", path: "/recce/view-recce" },
    //     {
    //       title: "Options For Approval",
    //       path: "/recce/options-for-approval",
    //     },
    //     {
    //       title: "Versions For Approval",
    //       path: "/recce/versions-for-approval",
    //     },
    //   ],
    // },

    // {
    //   key: "recce-mockup",
    //   title: "Recce Mockup",
    //   icon: "Layers",
    //   children: [
    //     { title: "Upload Mockup", path: "/recce/upload-mockup" },
    //     { title: "View Mockup", path: "/recce/view-mockup" },
    //     {
    //       title: "Version For Approval",
    //       path: "/recce/mockup-version-approval",
    //     },
    //   ],
    // },

    // {
    //   key: "recce-quotation",
    //   title: "Recce Quotation",
    //   icon: "FileText",
    //   children: [
    //     {
    //       title: "Create Measurement",
    //       path: "/recce/create-measurement",
    //     },
    //     {
    //       title: "View Measurement",
    //       path: "/recce/view-measurement",
    //     },
    //     {
    //       title: "Measurement For Approval",
    //       path: "/recce/measurement-approval",
    //     },
    //   ],
    // },

    // {
    //   key: "recce-reviews",
    //   title: "Recce Reviews",
    //   icon: "Star",
    //   path: "/recce/reviews",
    // },

    // {
    //   key: "recce-in-quotation",
    //   title: "Recce in Quotation",
    //   icon: "FileCheck",
    //   path: "/recce/recce-in-quotation",
    // },

    // {
    //   key: "daily-reporting",
    //   title: "Daily Reporting",
    //   icon: "CalendarDays",
    //   children: [
    //     { title: "Morning Reporting", path: "/recce/morning-report" },
    //     { title: "Evening Reporting", path: "/recce/evening-report" },
    //   ],
    // },

    // {
    //   key: "recce-executive",
    //   title: "Recce Executive",
    //   icon: "Users",
    //   path: "/recce/executive",
    // },

    // {
    //   key: "recommendation",
    //   title: "Recommendation",
    //   icon: "ThumbsUp",
    //   path: "/recce/recommendation-table",
    // },

    // {
    //   key: "overall-product",
    //   title: "Overall Product",
    //   icon: "Package",
    //   path: "/recce/overall-product",
    // },
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/recce/dashboard",
    },
    {
      key: "planning",
      title: "Planning",
      icon: "CalendarClock",
      children: [
        { title: "Upcoming Recce", path: "/recce/upcoming-recce" },
        {
          title: "Next Day Planning",
          path: "/recce/next-day-recce-planning",
        },
      ],
    },
    {
      key: "my-recce",
      title: "My Recce",
      icon: "ClipboardList",
      children: [
         { title: "Sales In Recce", path: "/recce/sales-in-recce" },
           { title: "Today's Recce", path: "/recce/todays-recce" },
        { title: "Received Recce", path: "/recce/received-recce" },
        { title: "Assigned Recce", path: "/recce/assigned-recce" },
        // { title: "Self Assigned Recce", path: "/recce/self-assigned-recce" },
        { title: "Flag Raised Recce", path: "/recce/flag-raised-recce" },
        { title: "Declined Recce", path: "/recce/rejected-recce" },
        { title: "Waiting Recce", path: "/recce/waiting-recce" },
        { title: "Lost Recce", path: "/recce/lost-recce" },
      ],
    },
    {
      key: "recce-workflow",
      title: "Draft",
      icon: "GitBranch",
      path: "/recce/workings",
    },
    // {
    //   key: "recce-in-review-client",
    //   title: "Recce in Review (Client)",
    //   icon: "UserCheck",
    //   path: "/recce/recce-review-client",
    // },
    {
      key: "recce-in-review-manager",
      title: "Recce in Review (Executive)",
      icon: "ShieldCheck",
      path: "/recce/recce-review-manager",
    },
    {
      key: "recce-in-design",
      title: "Recce In Design",
      icon: "Palette",
      path: "/recce/recce-in-design",
    },
    {
      key: "report",
      title: "Daily Report",
      icon: "FileBarChart",
      children: [
        { title: "Morning Report", path: "/recce/recce-morning-manager" },
        { title: "Evening Report", path: "/recce/recce-evening-manager" },
      ],
    },
    {
      key: "team-management",
      title: "Team Management",
      icon: "Users",
      path: "/recce/team",
    },
    {
      key: "recommendation",
      title: "Recommendation",
      icon: "ThumbsUp",
      path: "/recce/recommendation-table",
    },
  ],
};

const RecceSidebar = () => {
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
      "recce executive": "executive",
      manager: "manager",
      "recce manager": "manager",
      hod: "manager",
      "recce hod": "manager",
    }[role] || "executive";

  console.log("USER DATA →", user);
  console.log("DESIGNATION →", user?.designation);
  console.log("ROLE STRING →", role);
  console.log("NORMALIZED ROLE →", normalizedRole);

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
                    //    ${
                    //   isActive
                    //     ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    //     : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    // }`}
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
                          to={
                            child.path === "#" ? "/recce/working" : child.path
                          }
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
                  to={item.path === "#" ? "/recce/working" : item.path}
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

      {/* Footer */}
      {/* {!isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Icons.User size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{userRole}</p>
              <p className="text-gray-400 text-xs">Online</p>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default RecceSidebar;
