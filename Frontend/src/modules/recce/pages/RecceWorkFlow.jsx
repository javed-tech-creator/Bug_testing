import React from "react";
import { Eye, Pencil, X, Edit } from "lucide-react";
import Table from "../../../components/Table";
import { useSelector } from "react-redux";
import SelfTeamToggle from "../components/SelfTeamToggle";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { useNavigate } from "react-router-dom";

const workflowData = [
  {
    client: "Abc Mall",
    project: "Mall Facade Recce",
    product: "Facade Branding",
    address:
      "24, High Street, Andheri West\nLandmark: Near Metro Gate 3\nMumbai, MH 400053",
    visitTime: "11 Nov 25, 10:30AM",
    status: "Draft",
    id: "recce-1",
  },
  {
    client: "Bright Interiors",
    project: "Office Branding Survey",
    product: "Office Signage",
    address:
      "5th Floor, Omega Tower, MG Road\nLandmark: Next to City Bank\nBengaluru, KA 560001",
    visitTime: "11 Nov 25, 10:30AM",
    status: "Draft",
    id: "recce-2",
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

const RecceWorkFlow = () => {
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [projectStatus, setProjectStatus] = React.useState("");
  const [comment, setComment] = React.useState("");
  // Role-based toggle logic
  const res = useSelector((state) => state.auth?.userData);
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
  const isManager = normalizedRole === "manager";
  const [viewType, setViewType] = React.useState("self");

  const columnConfig = {
    action: {
      label: "Action",
      render: (_, row) => (
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={() =>
              navigate(`/recce/product-requirements/`, {
                state: { rowData: row, from: "client-review" },
              })
            }
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            title="View"
          >
            <Edit size={16} />
          </button>

          {/* <button
            onClick={() => {
              setSelectedRow(row);
              setProjectStatus("");
              setComment("");
              setIsEditOpen(true);
            }}
            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            title="Edit Status"
          >
            <Pencil size={16} />
          </button> */}
        </div>
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
    product: {
      label: "Product Name",
      render: (value) => <span className="text-gray-700">{value}</span>,
    },
    address: {
      label: "Full Address",
      render: (value) => {
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          value,
        )}`;

        return (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline whitespace-pre-line cursor-pointer"
            title="Open address in Google Maps"
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
    <div className="min-h-screen">
      <DesignSimpleHeader title="Recce Workflow" />

      {/* Self / Team Toggle */}
      {isManager && (
        <div className="flex justify-center my-4">
          <SelfTeamToggle value={viewType} onChange={setViewType} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <Table data={workflowData} columnConfig={columnConfig} />
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-md p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Update Project Status
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Status
                </label>
                <select
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Select Status</option>
                  <option>Postponed by Company</option>
                  <option>Postponed by Client</option>
                  <option>Hold by Company</option>
                  <option>Hold by Client</option>
                  <option>Reject by Company</option>
                  <option>Reject by Client</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("UPDATED →", {
                    row: selectedRow,
                    projectStatus,
                    comment,
                  });
                  setIsEditOpen(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecceWorkFlow;
