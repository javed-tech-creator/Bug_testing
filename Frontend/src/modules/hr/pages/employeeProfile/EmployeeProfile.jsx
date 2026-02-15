import {
  User,
  FileText,
  Briefcase,
  CreditCard,
  Home,
  Activity,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import {
  useGetEmployeeByIdQuery,
  useGetTrainingByEmployeeQuery,
} from "@/api/hr/employee.api";

import OverviewTab from "./components/OverviewTab";
import PersonalInfoTab from "./components/PersonalInfoTab";
import AddressTab from "./components/AddressTab";
import EmploymentTab from "./components/EmploymentTab";
import BankSalaryTab from "./components/BankSalaryTab";
import DocumentsTab from "./components/DocumentsTab";
import AttendanceLeaveTab from "./components/AttendanceLeaveTab";
import PerformanceTab from "./components/PerformanceTab";
import PayoutTab from "./components/PayoutTab";
import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";

export default function EmployeeProfile() {
  const [activeSection, setActiveSection] = useState("overview");
  const { id } = useParams();

  const { data: employeeData, isLoading } = useGetEmployeeByIdQuery(
    { id },
    { skip: !id }
  );
  const { data: traning } = useGetTrainingByEmployeeQuery(
    { id },
    { skip: !id }
  );
  const employee = employeeData?.data;
  console.log("employee", employeeData);
  console.log("traning", traning);

  if (isLoading) return <Loader />;

  const navItems = [
    { key: "overview", label: "Overview", icon: User },
    { key: "personal", label: "Personal Info", icon: FileText },
    { key: "address", label: "Address", icon: Home },
    { key: "employment", label: "Employment", icon: Briefcase },
    { key: "salary", label: "Bank & Salary", icon: CreditCard },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "attendance", label: "Attendance & Leave", icon: Activity },
    { key: "performance", label: "Performance", icon: Trophy },
    { key: "payout", label: "Payout", icon: CreditCard },
  ];

  const renderRightContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewTab employee={employee} />;
      case "personal":
        return <PersonalInfoTab employee={employee} />;
      case "address":
        return <AddressTab employee={employee} />;
      case "employment":
        return <EmploymentTab employee={employee} />;
      case "salary":
        return <BankSalaryTab employee={employee} />;
      case "documents":
        return <DocumentsTab employee={employee} />;
      case "attendance":
        return <AttendanceLeaveTab employee={employee} />;
      case "performance":
        return <PerformanceTab employee={employee} />;
      case "payout":
        return <PayoutTab employee={employee} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader title="Employee Profile" />

      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Employee Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Gradient Header */}
              <div className="h-24 bg-gradient-to-l from-neutral-800/80 to-black relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
              </div>

              {/* Profile Content */}
              <div className="relative px-6 pb-6 text-center">
                {/* Avatar with Camera Button */}
                <div className="flex justify-center -mt-12 mb-2">
                  <div className="relative group ">
                    <div className="flex justify-center -mt-10 mb-1">
                      <div className="w-20 h-20 rounded-full border-3 border-white ring-1 ring-white overflow-hidden bg-gray-100 flex items-center justify-center">
                        <img
                          src={employee.photo?.public_url || <User />}
                          alt={employee.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200">
          <Camera className="w-4 h-4 text-white" />
        </button> */}
                  </div>
                </div>

                {/* Employee Details */}
                <h2 className="text-xl font-semibold text-gray-900 ">
                  {employee.name}
                </h2>
                <p className="text-sm text-gray-500 font-medium mb-2">
                  ID: {employee.employeeId}
                </p>

                {/* Status Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <span className="text-xs font-semibold text-gray-700 capitalize">
                    {employee.department} • {employee.employeeType}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full cursor-pointer flex border border-gray-100 items-center justify-between p-3 rounded-sm transition-colors text-sm font-medium ${
                      activeSection === item.key
                        ? "bg-gradient-to-l from-neutral-800/80 to-black  text-white"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-8">
            <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
              {renderRightContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
