import React from "react";
import { Eye, CheckCircle, Clock, FileText } from "lucide-react";

import Table from "../../../../../../components/Table";

const workflowData = [
  {
    client: "Abc Mall",
    project: "Mall Facade Recce",
    address:
      "24, High Street, Andheri West\nLandmark: Near Metro Gate 3\nMumbai, MH 400053",
    visitTime: "11 Nov 25, 10:30AM",
    status: "Draft",
  },
  {
    client: "Bright Interiors",
    project: "Office Branding Survey",
    address:
      "5th Floor, Omega Tower, MG Road\nLandmark: Next to City Bank\nBengaluru, KA 560001",
    visitTime: "11 Nov 25, 10:30AM",
    status: "Completed",
  },
];

const statusBadge = (status) => {
  const baseClasses =
    "inline-flex items-center justify-center min-w-[90px] h-7 px-3 rounded-full text-xs font-semibold border";

  if (status === "Completed") {
    return (
      <span
        className={`${baseClasses} bg-green-50 text-green-700 border-green-200`}
      >
        Completed
      </span>
    );
  }

  if (status === "Draft") {
    return (
      <span
        className={`${baseClasses} bg-orange-50 text-orange-600 border-orange-200`}
      >
        Draft
      </span>
    );
  }

  if (status === "Started") {
    return (
      <span className={`${baseClasses} bg-red-50 text-red-700 border-red-200`}>
        Started
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`}
    >
      Pending
    </span>
  );
};

const ActiveReccesTable = () => {
  const columnConfig = {
    action: {
      label: "Action",
      render: () => (
        <button
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          title="View"
        >
          <Eye size={16} />
        </button>
      ),
    },
    status: {
      label: "Status",
      render: (value) => statusBadge(value),
    },
    client: {
      label: "Client",
      render: (value) => <span className="font-medium">{value}</span>,
    },
    project: {
      label: "Projects",
    },
    address: {
      label: "Full Address",
      render: (value) => {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          value
        )}`;

        return (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline whitespace-pre-line cursor-pointer"
            title="Open in Google Maps"
          >
            {value}
          </a>
        );
      },
    },
    visitTime: {
      label: "Date",
    },
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Active Recce
        </h2>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table data={workflowData} columnConfig={columnConfig} />
      </div>
    </div>
  );
};

export default ActiveReccesTable;
