import { X } from "lucide-react";
import Table from "@/components/Table";

const ClientDiscussionLogModal = ({ open, onClose }) => {
  if (!open) return null;

  const data = [
    {
      sno: "01",
      datetime: "11/12/25 10:00 AM",
      department: "Sales Dept.",
      companyRep: {
        name: "Rahul",
        role: "Sales Executive",
      },
      clientRep: {
        name: "Aman",
        role: "Founder",
      },
      discussion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      remarks:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      sno: "02",
      datetime: "11/12/25 10:00 AM",
      department: "Recce Dept.",
      companyRep: {
        name: "Aman",
        role: "Recce Executive",
      },
      clientRep: {
        name: "Satyam",
        role: "CEO",
      },
      discussion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      remarks:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      sno: "03",
      datetime: "11/12/25 10:00 AM",
      department: "Design Dept.",
      companyRep: {
        name: "Ajay",
        role: "Design Executive",
      },
      clientRep: {
        name: "Javed",
        role: "Owner",
      },
      discussion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      remarks:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
  ];

  const columnConfig = {
    sno: { label: "S.NO" },

    datetime: {
      label: "Date & Time",
    },

    department: {
      label: "Department",
    },

    companyRep: {
      label: "Company Representative Name",
      render: (val) => (
        <div>
          <div className="font-medium">{val.name}</div>
          <div className="text-xs text-blue-600">{val.role}</div>
        </div>
      ),
    },

    clientRep: {
      label: "Client / Representative Name",
      render: (val) => (
        <div>
          <div className="font-medium">{val.name}</div>
          <div className="text-xs text-blue-600">{val.role}</div>
        </div>
      ),
    },

    discussion: {
      label: "Discussion with Client",
      render: (val) => (
        <p className="text-sm text-slate-600 leading-relaxed">
          {val}
        </p>
      ),
    },

    remarks: {
      label: "Remarks",
      render: (val) => (
        <p className="text-sm text-slate-600 leading-relaxed">
          {val}
        </p>
      ),
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">
            Client Discussion Log
          </h2>

          <button
            className="rounded-md bg-red-600 p-2 text-white hover:bg-red-700"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="p-6 max-h-[70vh] overflow-auto">
          <Table data={data} columnConfig={columnConfig} />
        </div>
      </div>
    </div>
  );
};

export default ClientDiscussionLogModal;
