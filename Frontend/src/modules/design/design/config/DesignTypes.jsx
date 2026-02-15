import { MdRequestPage } from "react-icons/md";
import { viewAction } from "../components/action/ViewActionButton";
import { CopyPlus } from "lucide-react";

/* ---------- DESIGN TYPE CONFIG (columnArray + Actions included) ---------- */
export const getDesignTypeConfig = ({
  onView,
  onDesignReport,
  submitRequestDesign,
}) => ({
  received: {
    title: "Received Designs",
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
          <div className="flex gap-3 justify-center">
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
      { key: "deadline", label: "Deadline" },
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
          <div className="flex gap-3 justify-center">
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
      { key: "deadline", label: "Deadline" },
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
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "flagDate", label: "Flag Raised Date " },
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
      { key: "flagType", label: "Flag Type" },
      {
        key: "actions",
        label: "Actions",
        render: (_, row) => (
          <div className="flex gap-3">{viewAction(row, onView)}</div>
        ),
      },
    ],
  },

  "next-day-planning": {
    title: "Next-Day-Planning",
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
          <div className="flex items-center justify-center">
            {/* VIEW */}
            {viewAction(row, onView)}
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "createdAt", label: "Assigned Date" },
      { key: "deadline", label: "Completion Date" },
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
  assigned: {
    title: "Assigned Design",
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
          <div className="flex items-center justify-center">
            {/* VIEW */}
            {viewAction(row, onView)}
          </div>
        ),
      },
      { key: "designId", label: "Design ID" },
      { key: "createdAt", label: "Assigned Date" },
      { key: "deadline", label: "Completion Date" },
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
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "firstAskingTime", label: "1st Asking Time" },
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
      { key: "status", label: "Status" },
      { key: "waitingTime", label: "Waiting Time" },

      {
        key: "actions",
        label: "Actions",
        render: (_, row) => (
          <div className="flex gap-3">{viewAction(row, onView)}</div>
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
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "firstAskingTime", label: "1st Asking Time" },
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
      { key: "status", label: "Status" },
      { key: "waitingTime", label: "Waiting Time" },

      {
        key: "actions",
        label: "Actions",
        render: (_, row) => (
          <div className="flex gap-3">{viewAction(row, onView)}</div>
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
      { key: "designId", label: "Design ID" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      { key: "firstAskingTime", label: "1st Asking Time" },
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
      { key: "status", label: "Status" },
      { key: "waitingTime", label: "Waiting Time" },

      {
        key: "actions",
        label: "Actions",
        render: (_, row) => (
          <div className="flex gap-3">{viewAction(row, onView)}</div>
        ),
      },
    ],
  },

  upcoming: {
    title: "Upcoming Designs",
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
            <button
              onClick={() => submitRequestDesign(row)}
              title="Request Design"
              className="border cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md"
            >
              <CopyPlus size={22} />
            </button>
          </div>
        ),
      },
      { key: "client", label: "Client" },
      { key: "productName", label: "Product" },
      { key: "projectName", label: "Projects" },
      {
        key: "leadType",
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
