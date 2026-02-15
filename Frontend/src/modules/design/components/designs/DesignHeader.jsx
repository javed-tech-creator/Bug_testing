import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Clock,
  Flag,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DesignsHeader = ({
  title,
  onDateChange,
  onPriorityChange,
  showStatusFilter,
  onStatusChange,

  showDateFilter = true,
  showPriorityFilter = true,

  submissionDate,
  startedDate,
  showSubmissionDate = false,

  showDiscussionBtn = false,
  onDiscussionClick,

  showDesignId = false,
  designId,

  showDeadline = false,
  deadline,

  showRecievingDate,
  recievingDate,
  exportExcel = false,
  exportPdf = false,

  //manager will filter by executive
  executives = [], // [{ _id, name }]
  showExecutiveFilter = false,
  onExecutiveChange,

  showTimingFilter = false,
  onTimingChange,
  selectedTiming,

  showPlanningLogsBtn = false,
  onPlanningLogsClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className=" sticky -top-2 z-30 flex items-center justify-between bg-white shadow-md rounded-sm px-4 py-3 border my-5">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 border cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 ">
        {/* ✅ EXECUTIVE FILTER */}
        {showExecutiveFilter && (
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
            <User size={16} />
            <select
              className="bg-transparent outline-none text-sm cursor-pointer"
              onChange={(e) => onExecutiveChange?.(e.target.value)}
            >
              <option value="">All Executives</option>
              {executives.map((exec) => (
                <option key={exec._id} value={exec._id}>
                  {exec.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Design ID */}
        {showDesignId && designId && (
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-sm text-sm font-medium border border-blue-200">
            Design ID: <span className="font-semibold">{designId}</span>
          </div>
        )}

        {/* Deadline */}
        {showDeadline && deadline && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-sm text-sm font-medium border border-red-200">
            Deadline: <span className="font-semibold">{deadline}</span>
          </div>
        )}

        {/* Recieving date */}
        {showRecievingDate && recievingDate && (
          <div className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-sm text-sm font-medium border border-yellow-200">
            Receiving Date:{" "}
            <span className="font-semibold">{recievingDate}</span>
          </div>
        )}

        {/* Submission Date Badge */}
        {showSubmissionDate && (
          <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-sm text-sm font-medium border border-orange-200">
            Submission Date:{" "}
            <span className="font-semibold">{submissionDate}</span>
          </div>
        )}
        {startedDate && (
          <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-sm text-sm font-medium border border-orange-200">
            Started Date: <span className="font-semibold">{startedDate}</span>
          </div>
        )}

        {/* Client Discussion Button */}
        {showDiscussionBtn && (
          <button
            onClick={onDiscussionClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-medium shadow-sm"
          >
            Client Discussion Logs
          </button>
        )}
        {exportPdf && (
          <button
            onClick={onDiscussionClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-medium shadow-sm"
          >
            Export Pdf
          </button>
        )}
        {exportExcel && (
          <button
            onClick={onDiscussionClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-medium shadow-sm"
          >
            Export Excel
          </button>
        )}

        {/* DATE FILTER */}
        {showDateFilter && (
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
            <Calendar size={16} />
            <select
              onChange={(e) => onDateChange?.(e.target.value)}
              className="bg-transparent outline-none text-sm cursor-pointer"
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </select>
          </div>
        )}

        {/* PRIORITY FILTER */}
        {showPriorityFilter && (
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
            <Flag size={16} />
            <select
              onChange={(e) => onPriorityChange?.(e.target.value)}
              className="bg-transparent outline-none text-sm cursor-pointer"
            >
              <option value="">Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        )}

        {showStatusFilter && (
          <select
            className="border rounded-sm px-2 py-2 text-sm"
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="rejected">Rejected</option>
            <option value="modification_required">Modification Required</option>
            <option value="approved">Approved</option>
            <option value="submitted_to_client">Submitted To Client</option>
          </select>
        )}

        {/*  PLANNING LOGS BUTTON */}
        {showPlanningLogsBtn && (
          <button
            onClick={onPlanningLogsClick}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-sm text-sm"
          >
            <ClipboardList size={16} />
            Planning Logs
          </button>
        )}

        {/*  TIMING DROPDOWN */}
        {showTimingFilter && (
          <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
            <Clock size={16} />
            <select
              value={selectedTiming}
              onChange={(e) => onTimingChange?.(e.target.value)}
              className="bg-transparent outline-none text-sm" 
            >
              <option value="">Select Time</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="5:00 PM">5:00 PM</option>
              <option value="8:00 PM">8:00 PM</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignsHeader;
