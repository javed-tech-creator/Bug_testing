import React, { useState } from "react";
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
  IndianRupee
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/dss_logo.webp";
import * as Icons from "lucide-react";

const HrSidebar = () => {
  const [expandedNav, setExpandedNav] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const data = { role: "Admin" };
  const navigate = useNavigate();

  // useEffect(() => {
  //   if(window.innerWidth<768){
  //     setSidebarOpen(false)
  //   }
  // })

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      children: [],
      url: "/hr/dashboard",
    },
    // {
    //   name: 'Onboarding',
    //   icon: <UserPlus size={20} />,
    //   children: [
    //     { name: 'Add New Employee', url:"/hr/employee/add" },
    //     { name: 'Employee Onboarding Checklist', url: "/hr/onboarding/checklist" },
    //     { name: 'Auto-Create Employee ID', url: "/hr/onboarding/employee-id" }
    //   ]
    // },

    {
      name: "Employee Managment",
      icon: <Users size={20} />,
      children: [
        { name: "Add New Employee", url: "/hr/employee/onboarding" },
        { name: "Employee Management", url: "/hr/employee/list" }
      ],
    },
    // {
    //   name: "Department Management",
    //   icon: <Building2 size={20} />,
    //   children: [
    //     { name: "Manage Departments", url: "/hr/department/management" },
    //     { name: "Manage Designations", url: "/hr/designation/management" },
    //     {
    //       name: "Role & Access Permissions",
    //       url: "/hr/department/permissions",
    //     },
    //   ],
    // },
    // {
    //   name: "Vendor Empanelment",
    //   icon: <Icons.Handshake size={20} />,
    //   children: [
    //     { name: "Manage Departments", url: "/hr/department/management" },
    //     { name: "Manage Designations", url: "/hr/designation/management" },
    //     {
    //       name: "Role & Access Permissions",
    //       url: "/hr/department/permissions",
    //     },
    //   ],
    // },

    {
      name: "Attendance Management",
      icon: <Clock size={20} />,
      url: "/hr/attendance/logs" 
    },
    {
      name: "Leave Management",
      icon: <Users size={20} />,
      url: "/hr/leave/logs"
    },
    {
      name: "Payroll Management",
      icon: <IndianRupee size={20} />,
      url: "/hr/employee/Payroll"
    },




    // {
    //   name: "Training & Development",
    //   icon: <BookOpen size={20} />,
    //   children: [
    //     { name: "Schedule Training", url: "/hr/training/schedule" },
    //     { name: "Assign Trainees", url: "/hr/training/assign-trainees" },
    //     { name: "Upload Training Materials", url: "/hr/training/materials" },
    //     { name: "Attendance & Completion", url: "/hr/training/attendance" },
    //     {
    //       name: "Certification & Feedback",
    //       url: "/hr/training/certification-feedback",
    //     },
    //   ],
    // },
    {
      name: "Performance & Ratings",
      icon: <Trophy size={20} />,
      url: "/hr/performance/employee"
    },
    {
      name: "KPI & Incentives",
      icon: <ClipboardList size={20} />,
      children: [
        { name: "KPI Management", url: "/hr/kpi/employee" },
        { name: "Incentive Management", url: "/hr/kpi/incentive" },

      ],
    },

    // this is for a sop page
    {
      name: "SOP Management",
      icon: <BookOpen size={20} />,
      url: "/hr/sop"
    },
    {
      name: "Job Postings",
      icon: <Rocket size={20} />,
      children: [
        { name: "Manage Job Listings", url: "/hr/job/post" },
        { name: "All Applicantion", url: "/hr/job/candidates" },
        // { name: "Interview Scheduling", url:"/hr/recruitment/interviews" },
        // { name: "Offer Letters", url:"/hr/recruitment/offer-letters" }
      ],
    },
  ];

  const filteredNavItems =
    data?.role === "Admin"
      ? navItems
      : navItems.filter(
        (item) => item.name !== "Employee" && item.name !== "Recruitment"
      );

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
    if (item.children && item.children.length > 0) {
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
        {filteredNavItems.map((item, index) => {
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
                        <button
                          key={idx}
                          onClick={() => handleChildClick(child)}
                          className={`
                            block text-sm p-1 rounded-sm transition-colors duration-200 w-full text-left
                            ${currentPage === child.name
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

export default HrSidebar;
