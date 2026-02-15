import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import costomer from "../assets/Icons/customer.png";
import vendor from "../assets/Icons/vendor.png";
import contractor from "../assets/Icons/contractor.png";
import admin from "../assets/Icons/admin.png";
// import superadmin from "../assets/Icons/superadmin.png";
import factory from "../assets/Icons/factory.png";
import department from "../assets/Icons/department.png";
import hr from "../assets/Icons/department/hr.png";
import account from "../assets/Icons/department/account.png";
import finance from "../assets/Icons/department/finance.png";
import tech from "../assets/Icons/department/tech.png";
import marketing from "../assets/Icons/department/marketing.png";
import client from "../assets/Icons/client.png";
import rd from "../assets/Icons/department/r&d.png";
const departments = [
  {
    name: "Bussiness Empanalment",
    icon: department,
    path: "/departments",
  },
  {
    name: "Multi Unit Factories",
    icon: factory,
    path: "/pahses",
  },

  // {
  //   name: "Customer",
  //   icon: costomer,
  //   path: "#",
  //   // path: "/customer/login",
  // },
  {
    name: "Admin",
    icon: admin,
    path: "/admin/login",
  },
  {
    name: "HR",
    icon: hr,
    path: "/hr/login",
  },
  {
    name: "Vendor",
    icon: vendor,
    path: "/vendor/login",
  },

  {
    name: "Contractor",
    icon: contractor,
    path: "#",
  },

  // {
  //   name: "Super Admin",
  //   icon: superadmin,
  //   path: "#",
  // },

  {
    name: "Account",
    icon: account,
    path: "/account/dashboard",
  },
  {
    name: "Finance",
    icon: finance,
    path: "/finance/login",
  },
  {
    name: "Technology",
    icon: tech,
    path: "/tech/login",
  },
  {
    name: "Marketing",
    icon: marketing,
    // path: "#",
    path: "/marketing/login",
  },
  {
    name: "Client",
    icon: client,
    path: "/client/login",
  },
  {
    name: "R&D",
    icon: rd,
    path: "#",
  },
  {
    name: "Project Management",
    icon: rd,
    // path: "/projects",
    path: "/project/login",
  },

   
];

const Home = () => {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const handleLoging = (path) => {
    setLoading(path);
    navigate(path);
  };
  useEffect(() => {
    setLoading(null);
  }, []);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center ">
      <div className="text-center text-white mt-10 mb-7">
        <div className="flex items-center justify-center gap-4 mb-1">
          <div className="flex-1 max-w-20 h-[2px] bg-white" />
          <div className="text-lg font-medium tracking-wider whitespace-nowrap">
            Welcome To
          </div>
          <div className="flex-1 max-w-20 h-[2px] bg-white" />
        </div>

        <h1 className=" text-2xl md:text-4xl font-light tracking-wide">
          3S Digital Signage Solutions Pvt. Ltd.
        </h1>
      </div>

      <div
        className=" mb-10 flex items-center justify-center flex-wrap
grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-18 max-w-7xl w-full mx-auto"
      >
        {departments.map((dept, index) => (
          <div
            key={index}
            className=" w-[15rem] relative rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 pt-8 pb-5 px-6 text-center group"
          >
            {/* Icon positioned at top center, half outside */}
            <div className="absolute border border-gray-200 p-1 -top-11 left-1/2  transform -translate-x-1/2 bg-gray-50 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              {/* {dept.icon} */}
              <img
                src={dept.icon}
                loading="lazy"
                alt={dept.name}
                className=" p-2 object-center"
              />
            </div>

            <div className="mt-3 mb-2">
              <h2 className="text-lg font-medium text-gray-900 tracking-wide">
                {dept.name}
              </h2>
            </div>

            <button
              disabled={dept.path == "#" || loading}
              onClick={() => handleLoging(dept.path)}
              className={`${
                dept.path == "#" ? "cursor-not-allowed" : "cursor-pointer"
              } mt-auto  bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 px-6 py-1.5 text-sm font-medium tracking-wider uppercase border-none outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2`}
            >
              {loading === dept.path ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "LOGIN"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
