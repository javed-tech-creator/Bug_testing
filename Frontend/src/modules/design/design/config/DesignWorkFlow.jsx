import { FileUp, PlayCircle, UploadCloud } from "lucide-react";
import { viewAction } from "../components/action/ViewActionButton";

/* ---------- DESIGN TYPE CONFIG (columnArray + Actions included) ---------- */
export const getDesignWorkFlow = ({
  onView,
  submitNewDesign,
  submitModifiedDesign,
  submitMockupStart,
}) => ({
  view: {
    title: "Design Options ",
    endpoint: "view",
    columnArray: [
      {
        key: "index",
        label: "S.No",
        render: (_, __, index) => index + 1,
      },

      {
        key: "actions",
        label: "Actions",
        render: (_, row) => {
          const isModification = row.status === "modification_required";
          const isApproved = row.status === "approved";

          return (
            <div className="flex gap-3 justify-center items-center">
              {viewAction(row, onView)}

              {isModification && (
                <button
                  onClick={() => submitModifiedDesign(row)}
                  title="Submit Modified Design"
                  className="border-1 cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5  rounded-lg "
                >
                  <FileUp  size={18} />
                </button>
              )}

              {isApproved && (
                <button
                  onClick={() => submitMockupStart(row)}
                  title="Mark as Mockup Started"
                  className="border-1 cursor-pointer border-yellow-200 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 p-1.5  rounded-lg "
                >
                  <PlayCircle size={18} />
                </button>
              )}

              {!isModification && !isApproved && (
                <div className="flex justify-center text-gray-400">----</div>
              )}
            </div>
          );
        },
      },
      { key: "designId", label: "Design ID" },
      { key: "projectName", label: "Projects" },
      { key: "totalProducts", label: "Products" },
      { key: "receivedDate", label: "Received Date" },
      {
        key: "status",
        label: "Status",
        render: (value) => {
          const statusStyles = {
            approved: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700",
            modification_required: "bg-yellow-100 text-yellow-700",
            submitted_to_client: "bg-blue-100 text-blue-700",
          };

          const labelMap = {
            approved: "Approved",
            rejected: "Rejected",
            modification_required: "Modification Required",
            submitted_to_client: "Submitted to Client",
            submitted_to_manager: "Submitted to Manager",
            submitted_to_sales: "Submitted to Sales",
          };

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                statusStyles[value] || "bg-gray-100 text-gray-700"
              }`}
            >
              {labelMap[value] || value}
            </span>
          );
        },
      },

      {
        key: "priority",
        label: "Priority",
        render: (value) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              value === "High"
                ? "bg-red-100 text-red-600"
                : value === "Medium"
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {value}
          </span>
        ),
      },
      { key: "deadline", label: "Deadline" },
    ],
  },
  upload: {
    title: "Designs Upload",
    endpoint: "upload",
    columnArray: [
      {
        key: "index",
        label: "S.No",
        render: (_, __, index) => index + 1,
      },
      {
        key: "actions",
        label: "Actions",
        render: (_, row) => (
          <div className="flex gap-3 justify-center">
            {viewAction(row, onView)}
            <button
              onClick={() => submitNewDesign(row)}
              title="Upload Design Options"
              className="border-1 cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5  rounded-lg "
            >
              <UploadCloud size={18} />
            </button>
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "projectName", label: "Projects" },
      { key: "totalProducts", label: "Products" },
      { key: "receivedDate", label: "Received Date" },

      {
        key: "priority",
        label: "Priority",
        render: (value) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              value === "High"
                ? "bg-red-100 text-red-600"
                : value === "Medium"
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {value}
          </span>
        ),
      },
      { key: "deadline", label: "Deadline" },
    ],
  },
  options: {
    title: "Designs Options For Approval",
    endpoint: "manager-options",
    columnArray: [
      {
        key: "index",
        label: "S.No",
        render: (_, __, index) => index + 1,
      },
      {
        key: "view",
        label: "View",

        render: (_, row) => <> {viewAction(row, onView)}</>,
      },

      { key: "designId", label: "Design ID" },
      { key: "projectName", label: "Projects" },
      { key: "totalProducts", label: "Products" },
      {
        key: "priority",
        label: "Priority",
        render: (value) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              value === "High"
                ? "bg-red-100 text-red-600"
                : value === "Medium"
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {value}
          </span>
        ),
      },
      { key: "receivedDate", label: "Received Date" },
      { key: "deadline", label: "Deadline" },
    ],
  },
   versions: {
    title: "Option's Version For Approval",
    endpoint: "manager-options-versions",
    columnArray: [
      {
        key: "index",
        label: "S.No",
        render: (_, __, index) => index + 1,
      },
      {
        key: "view",
        label: "View",

        render: (_, row) => <> {viewAction(row, onView)}</>,
      },

      { key: "designId", label: "Design ID" },
      { key: "projectName", label: "Projects" },
      { key: "totalProducts", label: "Products" },
      { key: "designOption", label: "Selected Option" },
      {
        key: "priority",
        label: "Priority",
        render: (value) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              value === "High"
                ? "bg-red-100 text-red-600"
                : value === "Medium"
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {value}
          </span>
        ),
      },
      { key: "receivedDate", label: "Received Date" },
      { key: "deadline", label: "Deadline" },
    ],
  },
});
