import React, { useState } from "react";
import DesignsHeader from "../../components/designs/DesignHeader";
import { Eye } from "lucide-react";
import DesignsTable from "../../components/designs/DesignsTable";
import { viewAction } from "../../components/action/ViewActionButton";
import { useNavigate } from "react-router-dom";

const executivesData = [
  {
    id: 1,
    executive: "Rahul Sharma",
    employeeId: "EX-1023",
    phone: "9834345445",
    branch: "Chinhat",
    attendance: "Present",
    attendanceColor: "green",
    currentDesigns: 12,
    performance: 92,
  },
  {
    id: 2,
    executive: "Priya Verma",
    employeeId: "EX-1018",
    phone: "9834345445",
    branch: "Chinhat",
    attendance: "Absent",
    attendanceColor: "red",
    currentDesigns: 15,
    performance: 90,
  },
  {
    id: 3,
    executive: "Amit Patel",
    employeeId: "EX-1015",
    phone: "9834345445",
    branch: "Chinhat",
    attendance: "On Half Day",
    attendanceColor: "blue",
    currentDesigns: 6,
    performance: 82,
  },
];

const AllExecutives = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();
  const executiveStats = [
    {
      title: "Total Executives",
      count: 28,
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-600",
    },
    {
      title: "Active Today",
      count: 46,
      bg: "bg-purple-100",
      border: "border-purple-500",
      text: "text-purple-600",
    },
    {
      title: "On Half Day",
      count: 12,
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "text-yellow-600",
    },

    {
      title: "Absent",
      count: 10,
      bg: "bg-red-100",
      border: "border-red-500",
      text: "text-red-600",
    },
  ];

  const onView = (row) => {
    navigate(`/design/manager/designs/executive-profile/${row.id}`);
  };

  const ColumnArray = [
    {
      key: "index",
      label: "S.No",
      render: (_, __, index) => index + 1,
    },
    {
      key: "actions",
      label: "Action",
      render: (_, row) => (
        <div className="flex gap-3 justify-center items-center">
          {viewAction(row, onView)}
        </div>
      ),
    },
    {
      key: "executive",
      label: "Executive",
    },

    {
      key: "employeeId",
      label: "Employee ID",
    },

    {
      key: "phone",
      label: "Phone",
    },

    {
      key: "branch",
      label: "Branch",
    },

    {
      key: "attendance",
      label: "Attendance",
      render: (value, row) => (
        <span
          className={`flex items-center gap-2 text-sm font-medium
          ${
            row.attendanceColor === "green"
              ? "text-green-600"
              : row.attendanceColor === "red"
              ? "text-red-600"
              : "text-blue-600"
          }
        `}
        >
          <span className="w-2 h-2 rounded-full bg-current"></span>
          {value}
        </span>
      ),
    },

    {
      key: "currentDesigns",
      label: "Current Designs",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
          {value}
        </span>
      ),
    },

    {
      key: "performance",
      label: "Performance",
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-green-600 text-sm font-semibold">{value}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="px-5">
      <DesignsHeader
        title="Team Management"
        showDateFilter={false}
        showPriorityFilter={false}
        exportExcel={true}
        exportPdf={true}
        // showSubmitNewDesign={false}
        // onPriorityChange={(value) => setPriority(value)}
      />

      <div className="p-6 bg-gray-100 rounded-lg my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {executiveStats.map((item, index) => (
            <div
              key={index}
              className={`relative p-5 rounded-xl border-l-4 shadow-sm
        hover:shadow-md hover:scale-[1.02] transition-all duration-200
        ${item.bg} ${item.border}`}
            >
              {/* Decorative bubble */}
              {/* <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/40 -mt-6 -mr-6" /> */}

              <h3 className="text-sm font-semibold text-gray-700">
                {item.title}
              </h3>

              <p className={`text-3xl font-bold mt-3 ${item.text}`}>
                {item.count}
              </p>

              {/* <span className="text-xs text-gray-500 mt-2 inline-block">
                Updated today
              </span> */}
            </div>
          ))}
        </div>
      </div>

      <DesignsTable
        columnArray={ColumnArray}
        tableData={executivesData}
        total={executivesData.length}
        // isLoading={isLoading || isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        // showActiveFilter={true}      //  enable here only
        // isActive={isActive}
        // setIsActive={setIsActive}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default AllExecutives;
