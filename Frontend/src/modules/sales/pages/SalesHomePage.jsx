import React, { useState } from "react";
import {
  MoreVertical,
  ArrowUp,
  CheckCircle,
  Clock,
} from "lucide-react";

// Mock data - you'll need to replace these with your actual data imports
const statisticsCardsData = [
  {
    icon: () => <div className="w-6 h-6 bg-white rounded"></div>,
    title: "Today's Money",
    value: "$53,000",
    footer: { color: "text-green-500", value: "+55%", label: "than last week" }
  },
  {
    icon: () => <div className="w-6 h-6 bg-white rounded"></div>,
    title: "Today's Users",
    value: "2,300",
    footer: { color: "text-green-500", value: "+3%", label: "than last month" }
  },
  {
    icon: () => <div className="w-6 h-6 bg-white rounded"></div>,
    title: "New Clients",
    value: "+3,462",
    footer: { color: "text-red-500", value: "-2%", label: "than yesterday" }
  },
  {
    icon: () => <div className="w-6 h-6 bg-white rounded"></div>,
    title: "Sales",
    value: "$103,430",
    footer: { color: "text-green-500", value: "+5%", label: "than yesterday" }
  }
];

const statisticsChartsData = [
  {
    title: "Website View",
    color: "blue",
    chart: () => <div className="h-32 bg-blue-100 rounded"></div>,
    footer: "campaign sent 2 days ago"
  },
  {
    title: "Daily Sales",
    color: "pink",
    chart: () => <div className="h-32 bg-pink-100 rounded"></div>,
    footer: "updated 4 min ago"
  },
  {
    title: "Completed Tasks",
    color: "green",
    chart: () => <div className="h-32 bg-green-100 rounded"></div>,
    footer: "just updated"
  }
];

const projectsTableData = [
  {
    img: "https://via.placeholder.com/40",
    name: "Material XD Version",
    members: [
      { img: "https://via.placeholder.com/24", name: "Ryan Tompson" },
      { img: "https://via.placeholder.com/24", name: "Romina Hadid" }
    ],
    budget: "$14,000",
    completion: 60
  },
  {
    img: "https://via.placeholder.com/40",
    name: "Add Progress Track",
    members: [
      { img: "https://via.placeholder.com/24", name: "Ryan Tompson" }
    ],
    budget: "$3,000",
    completion: 10
  },
  {
    img: "https://via.placeholder.com/40",
    name: "Fix Platform Errors",
    members: [
      { img: "https://via.placeholder.com/24", name: "Jenna Kardi" },
      { img: "https://via.placeholder.com/24", name: "Ryan Tompson" }
    ],
    budget: "Not set",
    completion: 100
  }
];

const ordersOverviewData = [
  {
    icon: () => <div className="w-5 h-5 bg-green-500 rounded"></div>,
    color: "text-green-500",
    title: "$2400, Design changes",
    description: "22 DEC 7:20 PM"
  },
  {
    icon: () => <div className="w-5 h-5 bg-red-500 rounded"></div>,
    color: "text-red-500",
    title: "New order #1832412",
    description: "21 DEC 11 PM"
  },
  {
    icon: () => <div className="w-5 h-5 bg-blue-500 rounded"></div>,
    color: "text-blue-500",
    title: "Server payments for April",
    description: "21 DEC 9:34 PM"
  }
];

// StatisticsCard Component
const StatisticsCard = ({ icon, title, value, footer }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <span className="text-sm font-normal text-gray-600">
        <span className={`font-bold ${footer.color}`}>{footer.value}</span>
        {' '}{footer.label}
      </span>
    </div>
  </div>
);

// StatisticsChart Component
const StatisticsChart = ({ title, chart, footer }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="mb-4">{chart()}</div>
    <div className="flex items-center text-sm font-normal text-gray-600">
      <Clock className="h-4 w-4 text-gray-400 mr-1" />
      {footer}
    </div>
  </div>
);

// Avatar Component
const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
    />
  );
};

// Progress Component
const Progress = ({ value, color = "blue", className = "" }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500"
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div
        className={`h-full ${colorClasses[color]} rounded-full transition-all duration-300`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

// Dropdown Menu Component
const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded"
      >
        <MoreVertical className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Action
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Another Action
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            Something else here
          </button>
        </div>
      )}
    </div>
  );
};

// Tooltip Component (simplified)
const Tooltip = ({ content, children }) => (
  <div className="group relative">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
      {content}
    </div>
  </div>
);

export function Home() {
  return (
    <div className="mt-12 text-gray-900">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map((props) => (
          <StatisticsCard
            key={props.title}
            {...props}
            icon={React.createElement(props.icon, {
              className: "w-6 h-6 text-white",
            })}
          />
        ))}
      </div>
      
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart key={props.title} {...props} />
        ))}
      </div>
      
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden xl:col-span-2">
          <div className="m-0 flex items-center justify-between p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Projects
              </h2>
              <div className="flex items-center gap-1 text-sm font-normal text-gray-600">
                <CheckCircle className="h-4 w-4 text-gray-200" />
                <strong>30 done</strong> this month
              </div>
            </div>
            <DropdownMenu />
          </div>
          
          <div className="overflow-x-auto px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["companies", "members", "budget", "completion"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-gray-200/70 py-3 px-6 text-left"
                    >
                      <span className="text-[11px] font-medium uppercase text-gray-400">
                        {el}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }, key) => {
                    const className = `py-3 px-5 ${
                      key === projectsTableData.length - 1
                        ? ""
                        : "border-b border-gray-200/70"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Avatar src={img} alt={name} size="sm" />
                            <span className="text-sm font-bold text-gray-900">
                              {name}
                            </span>
                          </div>
                        </td>
                        <td className={className}>
                          <div className="flex">
                            {members.map(({ img, name }, key) => (
                              <Tooltip key={name} content={name}>
                                <Avatar
                                  src={img}
                                  alt={name}
                                  size="xs"
                                  className={`cursor-pointer border-2 border-white ${
                                    key === 0 ? "" : "-ml-2.5"
                                  }`}
                                />
                              </Tooltip>
                            ))}
                          </div>
                        </td>
                        <td className={className}>
                          <span className="text-xs font-medium text-gray-600">
                            {budget}
                          </span>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <div className="mb-1 text-xs font-medium text-gray-600">
                              {completion}%
                            </div>
                            <Progress
                              value={completion}
                              color={completion === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="m-0 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Orders Overview
            </h2>
            <div className="flex items-center gap-1 text-sm font-normal text-gray-600">
              <ArrowUp className="h-3.5 w-3.5 text-green-500" />
              <strong>24%</strong> this month
            </div>
          </div>
          
          <div className="pt-0 p-6">
            {ordersOverviewData.map(({ icon, color, title, description }, key) => (
              <div key={title} className="flex items-start gap-4 py-3">
                <div
                  className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-gray-50 after:content-[''] ${
                    key === ordersOverviewData.length - 1
                      ? "after:h-0"
                      : "after:h-4/6"
                  }`}
                >
                  {React.createElement(icon, {
                    className: `!w-5 !h-5 ${color}`,
                  })}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {title}
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    {description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;