import { useState } from "react"
import { X } from "lucide-react";
import Table from "@/components/Table";
import ClientDiscussionLogModal from "./ClientDiscussionLogModal";

const PlanningLogModal = ({ open, onClose, title }) => {
  if (!open) return null;

  const [openLog, setOpenLog] = useState(false);

  const data = [
    {
      sno: "01",
      datetime: "11-12-25 10:00 AM",
      coordinator: "Rahul Singh",
      manager: "Abhay Singh",
      projectStatus: "On Track",
      planningStatus: "Submitted",
      remark:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    },
    {
      sno: "02",
      datetime: "11-12-25 10:10 AM",
      coordinator: "Shivam Rai",
      manager: "Abhay Singh",
      projectStatus: "On Track",
      planningStatus: "Approved",
      remark:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    },
    {
      sno: "03",
      datetime: "11-12-25 12:00 PM",
      coordinator: "Shivam Rai",
      manager: "Abhay Singh",
      projectStatus: "Hold By Client",
      planningStatus: "Rejected",
      remark:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    },
  ];

  const columnConfig = {
    sno: { label: "S.NO" },

    datetime: { label: "Date-Time" },

    coordinator: {
      label: "Project Co-Ordinator",
      render: (val) => (
        <div>
          <div className="font-medium">{val}</div>
          <div className="text-xs text-blue-600">
            Project Co-Ordinator
          </div>
        </div>
      ),
    },

    manager: {
      label: "Project Manager",
      render: (val) => (
        <div>
          <div className="font-medium">{val}</div>
          <div className="text-xs text-blue-600">
            Project Manager
          </div>
        </div>
      ),
    },

    projectStatus: {
      label: "Project Status",
      render: (val) => {
        const styles = {
          "On Track": "bg-blue-50 text-blue-600",
          "Hold By Client": "bg-red-50 text-red-600",
        };
        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}
          >
            {val}
          </span>
        );
      },
    },

    planningStatus: {
      label: "Planning Status",
      render: (val) => {
        const styles = {
          Submitted: "bg-blue-50 text-blue-600",
          Approved: "bg-green-50 text-green-600",
          Rejected: "bg-red-50 text-red-600",
        };
        return (
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}
          >
            {val}
          </span>
        );
      },
    },

    remark: {
      label: "Planning Remark",
      render: (val) => (
        <p className="text-sm text-slate-600 leading-relaxed">
          {val}
        </p>
      ),
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg relative">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            {title}
          </h2>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700" onClick={() => setOpenLog(true)}>
              Client Discussion Logs
            </button>

            <button
              className="bg-red-600 text-white rounded p-2 hover:bg-red-700"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="p-6 max-h-[70vh] overflow-auto">
          <Table data={data} columnConfig={columnConfig} />
        </div>
      </div>

      {openLog &&
        <ClientDiscussionLogModal
          open={openLog}
          onClose={() => setOpenLog(false)}
        />
      }

    </div>
  );
};

export default PlanningLogModal;
