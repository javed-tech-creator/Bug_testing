import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "@/components/Table";
import { ArrowLeft, ChevronDown, Eye, Bell, Send, Edit } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

const QuotationsInReview = () => {
  const navigate = useNavigate();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();

  const normalizedRole =
    {
      executive: "executive",
      "quotation executive": "executive",
      manager: "manager",
      "quotation manager": "manager",
      hod: "manager",
      "quotation hod": "manager",
    }[role] || "executive";

  const isManager = normalizedRole === "manager";

  const data = [
    {
      id: 1,
      clientName: "GreenFields Co.",
      project: "Retails Store Signage",
      products: 12,
      date: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (1)",
      status: "Approved By Sales",
      deadline: "11 Nov 25, 11:30AM",
      actionType: "send",
    },
    {
      id: 2,
      clientName: "AgriMart",
      project: "Mall Facade Design's",
      products: 23,
      date: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (2)",
      status: "Submitted to Sales",
      deadline: "11 Nov 25, 11:30AM",
      actionType: "bell",
    },
    {
      id: 3,
      clientName: "SunHarvest",
      project: "Office Branding Survey",
      products: 32,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (3)",
      status: "Approved By Sales",
      deadline: "11 Nov 25, 11:30AM",
      actionType: "send",
    },
    {
      id: 4,
      clientName: "FreshStore",
      project: "Retails Store Signage",
      products: 12,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (4)",
      status: "Approved By Sales",
      deadline: "11 Nov 25, 11:30AM",
      actionType: "send",
    },
    {
      id: 5,
      clientName: "SunHarvest",
      project: "Mall Facade Design's",
      products: 32,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (5)",
      status: "Modification Needed By Sales",
      deadline: "11 Nov 25, 11:30AM",
      actionType: "modify",
    },
    {
      id: 6,
      clientName: "AgroHub",
      project: "Office Branding Survey",
      products: 22,
      date: "11 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (6)",
      status: "Submitted to Manager",
      deadline: "11 Nov 25, 11:30AM",
      actionType: "bell",
    },
  ];
  const feedbackData = [
    {
      date: "11 Nov 25, 10:30AM",
      name: "Rahul Sharma",
      designation: "Rahul Sharma - Sales Executive",
      status: "Approved By Sales",
      feedback:
        "Please recheck the unit pricing; it appears higher than the previously discussed estimate",
    },
    {
      date: "11 Nov 25, 10:30AM",
      name: "Aman",
      designation: "Aman - Quotation Manager",
      status: "Submitted to Manager",
      feedback:
        "Please recheck the unit pricing; it appears higher than the previously discussed estimate",
    },
  ];
  const columnConfig = {
    // S.No. is handled by Table.jsx, so start with actions for correct order
    actions: {
      label: "Actions",
      render: (_, row) => {
        if (row.actionType === "send")
          return (
            <div className="flex justify-center">
              <button
                title={isManager ? "Send to Sales Manger" : "Send to Manager"}
                onClick={() => navigate("/quotation/quotation-page")}
                className="flex items-center justify-center w-9 h-9 bg-blue-50 border border-blue-100 rounded text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          );

        if (row.actionType === "modify")
          return (
            <div className="flex justify-center">
              <button
                title="Make Modification"
                onClick={() =>
                  navigate(`/quotation/form/${row.id}`, {
                    state: { quotation: row, isModification: true },
                  })
                }
                className="flex items-center justify-center w-9 h-9 bg-orange-50 border border-orange-100 rounded text-orange-500 hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <Edit size={16} />
              </button>
            </div>
          );

        return (
          <div className="flex justify-center">
            <button
              title="Reminder"
              className="flex items-center justify-center w-9 h-9 bg-orange-400 rounded text-white hover:bg-orange-500 transition-colors cursor-pointer"
            >
              <Bell size={16} fill="white" />
            </button>
          </div>
        );
      },
    },
    status: {
      label: "Status",
      render: (val) => {
        const getStatusStyle = (v) => {
          if (v.includes("Approved"))
            return "bg-green-50 text-green-600 border-green-100";
          if (v.includes("Modification"))
            return "bg-orange-50 text-orange-500 border-orange-100";
          return "bg-blue-50 text-blue-600 border-blue-100";
        };
        return (
          <span
            className={`px-3 py-1 rounded border text-xs font-medium whitespace-nowrap ${getStatusStyle(
              val,
            )}`}
          >
            {val}
          </span>
        );
      },
    },
    feedback: {
      label: "Feedback",
      render: () => (
        <button
          onClick={() => setIsFeedbackModalOpen(true)}
          className="bg-blue-600 p-1.5 rounded text-white hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <Eye size={16} />
        </button>
      ),
    },
    clientName: { label: "Client Name" },
    project: { label: "Project Name" },
    products: { label: "Products" },
    date: { label: "Date" },
    deadline: { label: "Deadline" },
    // designation: {
    //   label: "Name & Designation",
    //   render: (_, row) => (
    //     <span>
    //       {row.clientName} - {row.project}
    //     </span>
    //   ),
    // },
    priorityT: {
      label: "Priority (T)",
      render: (val) => {
        const styles = {
          High: "bg-red-50 text-red-500 border-red-100",
          Medium: "bg-orange-50 text-orange-400 border-orange-100",
          Low: "bg-green-50 text-green-500 border-green-100",
        };
        return (
          <span
            className={`px-3 py-1 rounded border text-xs font-medium ${styles[val]}`}
          >
            {val}
          </span>
        );
      },
    },
    priorityN: {
      label: "Priority (N)",
      render: (val) => {
        const base = val.split(" ")[0];
        const styles = {
          High: "bg-red-50 text-red-500 border-red-100",
          Medium: "bg-orange-50 text-orange-400 border-orange-100",
          Low: "bg-green-50 text-green-500 border-green-100",
        };
        return (
          <span
            className={`px-3 py-1 rounded border text-xs font-medium ${styles[base]}`}
          >
            {val}
          </span>
        );
      },
    },
  };

  return (
    <div className="">
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Quotations In Review
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {["Date", "Priority", "Status"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {f} <ChevronDown size={14} />
            </button>
          ))}
        </div>
      </div>

      <Table data={data} columnConfig={columnConfig} />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        data={feedbackData}
      />
    </div>
  );
};

export default QuotationsInReview;
