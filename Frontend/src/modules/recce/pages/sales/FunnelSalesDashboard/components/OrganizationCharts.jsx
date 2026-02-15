import React from "react";

export default function OrganizationChars({ onDepartmentSelect }) {
  const executive = {
    name: "Mohmmad Suhel",
    role: "Executive",
  };

  const departments = [
    { name: "Clients", count: 100, color: "bg-orange-500" },
    { name: "Franchise's", count: 20, color: "bg-purple-500" },
    { name: "Business Associate's", count: 4, color: "bg-blue-500" },
    { name: "Partner's", count: 7, color: "bg-green-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {/* Executive Level */}
        <div className="flex justify-center relative">
          <div className="bg-blue-500 text-white px-8 py-4 rounded-lg shadow-lg font-semibold text-center min-w-[280px] relative z-10">
            <div className="text-xl">{executive.name}</div>
            <div className="text-sm opacity-90">({executive.role})</div>
          </div>

          {/* Vertical line down from executive box */}
          <div
            className="absolute left-1/2 w-0.5 bg-gray-800 transform -translate-x-1/2 z-0"
            style={{ top: "100%", height: "60px" }}
          ></div>

          {/* Arrow pointing down */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-0"
            style={{ top: "calc(100% + 60px)" }}
          >
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-800"></div>
          </div>
        </div>

        {/* Spacing */}
        <div style={{ height: "68px" }}></div>

        {/* Horizontal Connector Line */}
        <div className="relative" style={{ height: "60px" }}>
          {/* Main horizontal line */}
          <div
            className="absolute left-0 right-0 h-0.5 bg-gray-800"
            style={{ top: "0px" }}
          ></div>

          {/* Vertical lines down to departments with arrows */}
          {departments.map((_, index) => (
            <div key={index}>
              {/* Vertical line */}
              <div
                className="absolute w-0.5 bg-gray-800"
                style={{
                  left: `${12.5 + index * 25}%`,
                  transform: "translateX(-50%)",
                  top: "0px",
                  height: "52px",
                }}
              ></div>
              {/* Arrow at bottom */}
              <div
                className="absolute"
                style={{
                  left: `${12.5 + index * 25}%`,
                  transform: "translateX(-50%)",
                  top: "52px",
                }}
              >
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gray-800"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Department Level */}
        <div className="grid grid-cols-4 gap-4 relative z-10">
          {departments.map((dept, index) => (
            <div key={index} className="flex justify-center">
              <div
                className={`${dept.color} text-white px-6 py-4 rounded-lg shadow-lg font-semibold text-center transition-transform hover:scale-105 cursor-pointer min-w-[200px]`}
                onClick={() => onDepartmentSelect(dept.name)}
              >
                <div className="text-lg">{dept.name}</div>
                <div className="text-sm opacity-90">({dept.count})</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
