import { viewAction } from "../components/action/ViewActionButton";
import { UserPen, UserPlus } from "lucide-react";

const statusConfig = {
  "Hold by Client": {
    label: "Hold by Client",
    className: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  "Postponed by Client": {
    label: "Postponed by Client",
    className: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  "Hold by Company": {
    label: "Hold by Company",
    className: "bg-red-100 text-red-700 border border-red-300",
  },
  "Postponed by Company": {
    label: "Postponed by Company",
    className: "bg-red-100 text-red-700 border border-red-300",
  },
};
const StatusBadge = ({ status }) => {
  const config = statusConfig[status];

  if (!config) return null;

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${config.className}`}
    >
      {config.label}
    </span>
  );
};
export const MANAGER_STATUS = {
  WAITING: "waiting_for_acceptance",
  ACCEPTED: "accepted",
  DECLINED: "declined",
};

/* ---------- DESIGN TYPE CONFIG (columnArray + Actions included) ---------- */
export const getManagerDesignTypes = ({
  onView,
  // submitReassign,
  submitAssign,
  // submitReassigInNextDay,
  submitRequestDesign,
}) => ({
  assigned: {
    title: "Assigned Designs",
    endpoint: "assigned",
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
          <div className="flex items-center justify-center space-x-2">
            {/* VIEW */}
            {viewAction(row, onView)}

            {/* <button
              onClick={() => submitReassign(row)}
              title="Re-assign"
              className="border-1 cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5  rounded-lg "
            >
              <UserPen size={18} />
            </button> */}
          </div>
        ),
      },
      { key: "assigned", label: "Executive Name" },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "createdAt", label: "Assigned Date" },

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
    ],
  },

  incoming: {
    title: "Incoming Designs",
    endpoint: "incoming",
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
          <div className="flex items-center justify-center space-x-2">
            {/* VIEW */}
            {viewAction(row, onView)}
          </div>
        ),
      },
      { key: "assigned", label: "Executive Name" },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "createdAt", label: "Assigned Date" },

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
    ],
  },

  today: {
    title: "Today Designs",
    endpoint: "today",
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
          <div className="flex items-center space-x-2 justify-center">
            {/* VIEW */}
            {viewAction(row, onView)}
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "createdAt", label: "Date" },

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
    ],
  },

  received: {
    title: "Received / Accepted Designs",
    endpoint: "received",
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
          <div className="flex gap-3 items-center justify-center">
            {viewAction(row, onView)}
            <button
              onClick={() => submitAssign(row)}
              title="Assign"
              className="border-1 cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5  rounded-lg "
            >
              <UserPlus size={18} />
            </button>
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "createdAt", label: "Received Date" },

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
    ],
  },

  "my-received": {
    title: "Self Assigned Designs",
    endpoint: "received",
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
          <div className="flex gap-3 items-center justify-center">
            {viewAction(row, onView)}
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "createdAt", label: "Received Date" },

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
    ],
  },

  "flag-raised": {
    title: "Flag Raised Designs",
    endpoint: "flag-raised",
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
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "createdAt", label: "Flag Raised Date " },
      { key: "raised_by", label: "Raised By" },
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

      {
        key: "flagType",
        label: "Flag Type",
        render: (value) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              value === "Red"
                ? "bg-red-100 text-red-600"
                : value === "Yellow"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-green-100 text-green-600"
            }`}
          >
            {value}
          </span>
        ),
      },
    ],
  },

  "next-day-planning": {
    title: "Next Day Planning Designs",
    endpoint: "next-day-planning",
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
          <div className="flex gap-3  justify-center">
            {viewAction(row, onView)}
            {/* <button
              onClick={() => submitReassigInNextDay(row)}
              title="Re-assign"
              className="border-1 cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5  rounded-lg "
            >
              <UserPen size={18} />
            </button> */}
          </div>
        ),
      },
      {
        key: "manager_status",
        label: "Status",
        render: (value) => {
          const STATUS_MAP = {
            waiting_for_acceptance: {
              label: "Waiting For Acceptance",
              className: "bg-yellow-100 text-yellow-700",
            },
            accepted: {
              label: "Accepted",
              className: "bg-green-100 text-green-700",
            },
            decline: {
              label: "Declined",
              className: "bg-red-100 text-red-700",
            },
          };

          const status = STATUS_MAP[value] || {};

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}
            >
              {status.label || "N/A"}
            </span>
          );
        },
      },
      { key: "remark", label: "Remark" },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
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
    ],
  },
  "recce-in-design": {
    title: "Recce In Design",
    endpoint: "recce-in-design",
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
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
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
    ],
  },
  lost: {
    title: "Lost Designs",
    endpoint: "lost",
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
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      {
        key: "priority",
        label: "Lead Type",
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
    ],
  },

  declined: {
    title: "Declined Designs",
    endpoint: "declined",
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
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "createdAt", label: "Decline Date " },
      { key: "raised_by", label: "Decline By" },
      {
        key: "priority",
        label: "Lead Type",
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
    ],
  },

  waiting: {
    title: "Waiting Designs",
    endpoint: "waiting",
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
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "askingTime", label: "1st Asking Time" },
      {
        key: "priority",
        label: "Lead Type",
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
      {
        key: "status",
        label: "Status",
        render: (value) => <StatusBadge status={value} />,
      },
      { key: "waitingTime", label: "Waiting Time" },
      { key: "lastIntractionDate", label: "Last Intraction Date" },
    ],
  },

  upcoming: {
    title: "Possible Designs",
    endpoint: "upcoming",
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
          <div className="flex gap-3  justify-center">
            {viewAction(row, onView)}
          </div>
        ),
      },
      { key: "client", label: "Client" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      {
        key: "priority",
        label: "Lead Type",
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
    ],
  },
});
