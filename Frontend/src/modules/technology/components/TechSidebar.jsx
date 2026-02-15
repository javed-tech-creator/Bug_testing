import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import logo from "../../../assets/dss_logo.webp";
import ModalForm from "./helpdesk/RaisingTicketsForm";
import { useSelector } from "react-redux";

const roleSidebarItems = {
  techHOD: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/tech/dashboard",
    },
    {
      key: "asset-management",
      title: "IT Asset Management",
      icon: "Monitor",
      path: "/tech/assets/list",
    },
    {
      key: "software-license",
      title: "Software & Licensing Management",
      icon: "KeyRound",
      path: "/tech/software-license/list",
    },
    {
      key: "support-tickets",
      title: "IT Helpdesk & Ticketing System",
      icon: "LifeBuoy",
      path: "/tech/tickets-helpdesk/list",
    },
    {
      key: "network-monitoring",
      title: "Networking & Infrastructure",
      icon: "Wifi",
      path: "/tech/network-infrastructure/list",
    },
    {
      key: "amc-contracts",
      title: "Vendor & AMC Management",
      icon: "FileText",
      path: "/tech/vendor-amc-management/list",
    },
    {
      key: "data-security",
      title: "Data Security & Access Control",
      icon: "ShieldCheck",
      path: "/tech/data-access-control/list",
    },
  ],
  Executive: [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: "LayoutDashboard",
      path: "/tech/dashboard",
    },
    {
      key: "my-assets",
      title: "My Assets",
      icon: "Monitor",
      path: "/tech/employee-assets/list",
    },
    {
      key: "my-software",
      title: "My Software & License",
      icon: "FileBadge2",
      path: "/tech/software-license-employee/list",
    },
    {
      key: "support-tickets",
      title: "My Assigned Tickets",
      icon: "LifeBuoy",
      path: "/tech/employee-tickets/list",
    },
  ],
};

const TechSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ticketType, setTickettype] = useState("");
  const [supportStep, setSupportStep] = useState("home");
  const navigate = useNavigate();
  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;
  console.log("userData",userData);

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/tech/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim();
  console.log("userRole",userRole);
  

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Default sidebar items (fallback)
  let sidebarItems = [];

  if (userRole === "Executive") {
    sidebarItems = roleSidebarItems["Executive"];
  } else if (userRole === "techHOD" || userRole === "Manager") {
    sidebarItems = roleSidebarItems["techHOD"];
  } else {
    // agar koi unknown role hai to empty
    sidebarItems = [];
  }

  return (
    <div
      className={`relative ${
        isCollapsed ? "w-16" : "w-64"
      } bg-black h-screen ease-in-out shadow-2xl flex flex-col`}
    >
      {/* Header */}
      <div className="p-1 border-b border-gray-200/20">
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

          return (
            <NavLink
              key={index}
              to={item.path === "#" ? "/recce/working" : item.path}
              className={({ isActive }) => `
                flex items-center gap-2 p-2 rounded-lg transition-all duration-200 group
                ${
                  isActive
                    ? "text-white  bg-neutral-800"
                    : "text-gray-300 hover:text-white"
                }
              `}
              title={isCollapsed ? item.title : ""}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/*  Fixed Support Button at Bottom */}
      <div
        onClick={() => setIsSupportOpen(true)}
        className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-2 p-3 cursor-pointer bg-neutral-800 tex hover:bg-neutral-900 text-white transition-all duration-200"
      >
        {/* If expanded → show text + icon, else → only icon */}
        {!isCollapsed && <span className="text-sm font-medium">Support</span>}
        {/* Icon with tooltip */}
        <div className="relative">
          <Icons.HelpCircle size={20} className="cursor-pointer " />
        </div>
      </div>

      {/* Support Drawer / Modal */}
      {isSupportOpen && (
        <ModalForm
          isOpen={isOpen}
          ticketType={ticketType}
          onClose={() => {
            setIsOpen(false);
            setTickettype("");
            setSupportStep("home");
            setIsSupportOpen(false);
          }}
        />
      )}

      {/*  Support Drawer / Modal */}
      {isSupportOpen && (
        <>
          {/* Expanded Sidebar → Drawer opens above support button */}
          {!isCollapsed ? (
            <div className="absolute bottom-14 left-0 w-full z-50">
              <div className="w-full bg-white shadow-xl flex flex-col rounded-t-lg  h-[60vh]">
                {/* Header for Create Support Ticket */}
                <div className="bg-neutral-900 text-white px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {/* Back Arrow → only when supportStep !== "home" */}
                    {supportStep !== "home" && (
                      <button
                        onClick={() => setSupportStep("home")}
                        className="text-gray-300 hover:text-white cursor-pointer"
                      >
                        <Icons.ArrowLeft size={18} />
                      </button>
                    )}

                    <div>
                      {supportStep === "home" ? (
                        <>
                          <h2 className="font-semibold text-sm">Help center</h2>
                          <p className="text-xs text-gray-300">
                            How can we help you today?
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="font-semibold text-sm">
                            Create Support Ticket
                          </h2>
                          <p className="text-xs text-gray-300">
                            Choose a topic to continue
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setSupportStep("home");
                      setTickettype("");
                      setIsSupportOpen(false);
                    }}
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-4">
                  {supportStep === "home" ? (
                    <>
                      <h3 className="text-xs font-semibold text-gray-700 mb-2">
                        Get in touch
                      </h3>
                      <button
                        onClick={() => setSupportStep("create")}
                        className="w-full flex items-center gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        <Icons.FileText size={16} />
                        Create support ticket
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Create Support Ticket Step */}
                      <>
                        <button
                          onClick={() => {
                            setTickettype("Hardware");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 ${
                            ticketType === "Hardware" ? "bg-blue-300" : ""
                          } transition`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Cpu size={16} />
                            Hardware
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setTickettype("Software");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition mt-2 ${
                            ticketType === "Software" ? "bg-blue-300" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Code size={16} />
                            Software
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setTickettype("Internet");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition mt-2 ${
                            ticketType === "Internet" ? "bg-blue-300" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Wifi size={16} />
                            Internet
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setTickettype("Email");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition mt-2 ${
                            ticketType === "Email" ? "bg-blue-300" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Mail size={16} />
                            Email
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>
                      </>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Collapsed Sidebar → Right side drawer */
            <div className="fixed inset-0 bg-black/30 flex justify-start z-10">
              <div className="w-80 bg-white h-full shadow-xl flex flex-col ml-16">
                {/* Header for Create Support Ticket */}
                <div className="bg-neutral-900 text-white px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {/* Back Arrow → only show supportStep !== "home" */}
                    {supportStep !== "home" && (
                      <button
                        onClick={() => setSupportStep("home")}
                        className="text-gray-300 hover:text-white cursor-pointer"
                      >
                        <Icons.ArrowLeft size={18} />
                      </button>
                    )}

                    <div>
                      {supportStep === "home" ? (
                        <>
                          <h2 className="font-semibold text-sm">Help center</h2>
                          <p className="text-xs text-gray-300">
                            How can we help you today?
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="font-semibold text-sm">
                            Create Support Ticket
                          </h2>
                          <p className="text-xs text-gray-300">
                            Choose a topic to continue
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setSupportStep("home");
                      setIsSupportOpen(false);
                    }}
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 overflow-y-auto">
                  {supportStep === "home" ? (
                    <>
                      <h3 className="text-xs font-semibold text-gray-700 mb-2">
                        Get in touch
                      </h3>
                      <button
                        onClick={() => setSupportStep("create")}
                        className="w-full flex items-center gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        <Icons.FileText size={16} />
                        Create support ticket
                      </button>

                      {/* <div className="mt-4">
                  <Link
                    to="/google.com"
                    target="_blank"
                    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  >
                    Documentation <Icons.ExternalLink size={14} />
                  </Link>
                </div> */}
                    </>
                  ) : (
                    <>
                      <div className="p-1 flex-1 overflow-y-auto">
                        <button
                          onClick={() => {
                            setTickettype("Hardware");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition ${
                            ticketType === "Hardware" ? "bg-blue-300" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Cpu size={16} />
                            Hardware
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setTickettype("Software");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition mt-2 ${
                            ticketType === "Software" ? "bg-blue-300" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Code size={16} />
                            Software
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setTickettype("Internet");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition mt-2 ${
                            ticketType === "Internet" ? "bg-blue-300" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Wifi size={16} />
                            Internet
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>

                        <button
                          onClick={() => {
                            setTickettype("Email");
                            setIsOpen(true);
                          }}
                          className={`w-full flex items-center justify-between gap-2 p-3 border rounded-lg text-sm hover:bg-gray-100 transition mt-2 ${
                            ticketType === "Email" ? "bg-blue-300" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Icons.Mail size={16} />
                            Email
                          </span>
                          <Icons.ChevronRight size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* <ModalForm isOpen={isOpen}
           ticketType={ticketType}
           onClose={() => {
            setIsOpen(false);
            setTickettype("");
            setSupportStep("home");
            setIsSupportOpen(false);
          }} /> */}
        </>
      )}
    </div>
  );
};

export default TechSidebar;
