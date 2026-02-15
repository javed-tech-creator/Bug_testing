import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import logo from '../../../assets/dss_logo.webp'
import { useSelector } from "react-redux";
const roleSidebarItems = {
  "SaleHOD": [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/sales/dashboard",
    },
    {
      key: "raw-lead-management",
      title: "Raw Lead Management",
      icon: "PhoneCall",
      children: [
        { title: "Add Lead", path: "/sales/leads/add" },
        { title: "Total Leads", path: "/sales/leads/view" },
        { title: "Pending Leads", path: "/sales/leads/pending" },
        { title: "Lost Leads", path: "/sales/leads/lost" },
      ],
    },
    {
      key: "lead-management",
      title: "Lead Management",
      icon: "FileSpreadsheet",
      children: [
        { title: "Lead Managment Sheet", path: "/sales/leads/sheet" },
        { title: "Reporting", path: "/sales/reporting" },
      ],
    },
    {
      key: "sales-form",
      title: "Sales In Form",
      icon: "FileText",
      path: "/sales/leads/client-briefing",
    },
    {
      key: "client-briefing",
      title: "Sales Client Briefing",
      icon: "UserCheck",
      path: "/sales/leads/client-briefing-list",
    },
    {
      key: "management-sheet",
      title: "Sales Management Sheet",
      icon: "Sheet",
      path: "/sales/sales-management-sheet",
    },
    {
      key: "daily-reporting",
      title: "Daily Reporting",
      icon: "CalendarDays",
      path: "/sales/working",
    },
    {
      key: "performance",
      title: "Performance",
      icon: "TrendingUp",
      children: [
        { title: "Sales Target", path: "/sales/working", },
        { title: "Sales Incentive", path: "/sales/working", },
      ],
    },
  ],
  "SalesTL": [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/sales/dashboard",
    },
    {
      key: "add-lead",
      title: "Add Lead",
      icon: "PhoneCall",
      path: "/sales/leads/add",
    },
    {
      key: "lead-management",
      title: "Lead Management",
      icon: "FileSpreadsheet",
      children: [
        { title: "Total Leads", path: "/sales/leads/view" },
        { title: "My Leads", path: "/sales/leads/indivisual-list" },
        { title: "Lost Leads", path: "/sales/leads/lost" },
        { title: "Lead Managment", path: "/sales/leads/sheet" }
      ],
    },
    // {
    //   key: "sales-form",
    //   title: "Sales In Form",
    //   icon: "FileText",
    //   path: "/sales/leads/client-briefing",
    // },
    // {
    //   key: "client-briefing",
    //   title: "Sales Client Briefings",
    //   icon: "UserCheck",
    //   path: "/sales/leads/client-briefing-list",
    // },
    {
      key: "management-sheet",
      title: "Sales Management Sheet",
      icon: "Sheet",
      path: "/sales/sales-management-sheet",
    },
     {
      key: "quotation-sheet",
      title: "Quotation",
      icon: "Sheet",
      path: "/sales/quotation/sheet",
    },
    // {
    //   key: "daily-reporting",
    //   title: "Daily Reporting",
    //   icon: "CalendarDays",
    //   path: "/sales/reporting?shift=morning",
    // },
    {
      key: "daily-reporting",
      title: "Daily Reporting",
      icon: "CalendarDays",
      path: "/sales/reporting",
      children: [
        { title: "Morning Report", key:"morning", path: "/sales/reporting/manager/morning" },
        { title: "Evening Report", key:"evening", path: "/sales/reporting/manager/evening" }
      ],
    },
    {
      key: "performance",
      title: "Performance",
      icon: "TrendingUp",
      children: [
        { title: "Sales Target", path: "/sales/performance/target", },
        { title: "Sales Incentive", path: "/sales/salesEmployee/performance/incentive", },
      ],
    },
    {
      key: "team-overview",
      title: "Team Overview",
      icon: "User",
      path: "/sales/salesEmployee/list",
    },
    {
      key: "old-client",
      title: "Old Client Overview",
      icon: "bookUser",
      path: "/sales/old-client",
    },
    //  {
    //   key: "ClientProfile",
    //   title: "Client Profile",
    //   icon: "TrendingUp",
    //   path:"/sales/client-overview"
    // },
  ],

  "SaleEmployee": [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/sales/dashboard",
    },
    {
      key: "add-lead",
      title: "Add Lead",
      icon: "PhoneCall",
      path: "/sales/leads/add",
    },

    {
      key: "lead-management",
      title: "Lead Management",
      icon: "FileSpreadsheet",
      children: [
        // { title: "Add Lead", path: "/sales/leads/add" },
        { title: "Assign Leads", path: "/sales/leads/assign-lead" },
        { title: "My Leads", path: "/sales/leads/indivisual-list" },
        { title: "Lost Leads", path: "/sales/leads/lost" },
        { title: "Lead Managment", path: "/sales/leads/sheet" }
      ],
    },
    // {
    //   key: "lead-management",
    //   title: "Lead Management",
    //   icon: "FileSpreadsheet",
    //   path: "/sales/leads/sheet"
    // },
    // {
    //   key: "sales-form",
    //   title: "Sales In Form",
    //   icon: "FileText",
    //   path: "/sales/leads/client-briefing",
    // },
       {
      key: "quotation-sheet",
      title: "Quotation",
      icon: "Sheet",
      path: "/sales/quotation/sheet",
    },
    {
      key: "management-sheet",
      title: "Sales Management Sheet",
      icon: "Sheet",
      path: "/sales/sales-management-sheet",
    },

    {
      key: "daily-reporting",
      title: "Daily Reporting",
      icon: "CalendarDays",
      path: "/sales/reporting",
      children: [
        { title: "Morning Report", path: "/sales/reporting/morning" },
        { title: "Evening Report", path: "/sales/reporting/evening" }
      ],
    },
    {
      key: "performance",
      title: "Performance",
      icon: "TrendingUp",
      children: [
        { title: "Sales Target", path: "/sales/salesEmployee/performance/target/dashboard", },
        { title: "Sales Incentive", path: "/sales/salesEmployee/performance/incentive", },
      ],
    },
    {
      key: "old-client",
      title: "Old Client Overview",
      icon: "bookUser",
      path: "/sales/old-client",
    },
    // {
    //   key: "profle-overview",
    //   title: "Profile Overview",
    //   icon: "User",
    //   path: `/sales/salesEmployee/profile/:id`,
    // },
    // {
    //   key: "ClientProfile",
    //   title: "Client Profile",
    //   icon: "TrendingUp",
    //   path:"/sales/client-overview"
    // },
  ],
};

const SalesSidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {}
  const designation = user?.designation?.title?.toLowerCase() || "";

  let selectedRole = "SaleEmployee";
  console.log(designation)
  if (designation.includes("hod")) {
    selectedRole = "SaleHOD";
  } else if (designation.includes("tl") || designation.includes("team lead") || designation.includes("TL")) {
    selectedRole = "SalesTL";
  }
  else if (designation.includes("Sales Excutive") || designation.includes("excutive") || designation.includes("sales executive")) {
    selectedRole = "SaleEmployee"
  }
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

  const sidebarItems = roleSidebarItems[selectedRole] || [];

  return (
    <div className={`${isCollapsed ? 'w-16  tracking-wider flex flex-col justify-center items-center' : 'w-64'} bg-black  h-screen ease-in-out shadow-2xl`}>
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
                    title={isCollapsed ? item.title : ''}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <Icons.ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""
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
                            ${isActive
                              ? 'text-white bg-neutral-800'
                              : 'text-gray-400 hover:text-white '
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
                    ${isActive
                      ? 'text-gray-300'
                      : 'text-gray-300 hover: hover:text-white'
                    }
                  `}
                  title={isCollapsed ? item.title : ''}
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

export default SalesSidebar;