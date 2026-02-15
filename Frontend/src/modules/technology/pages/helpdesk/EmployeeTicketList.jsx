import { useGetTicketsQuery, useUpdateTicketStatusMutation } from "@/api/technology/helpdesk.api";
import React, { useState } from "react";
import StatusHistoryModal from "../../components/helpdesk/StatusHistory";
import PageHeader from "@/components/PageHeader";
import TechnologyTable from "../../components/TechnologyTable";
import { FaImage, FaSpinner, FaTicketAlt, FaVideo } from "react-icons/fa";
import MediaAttachment from "../../components/helpdesk/MediaAttachment";
import { toast } from "react-toastify";

const EmployeeTicketList = () => {
  const [isAttachmentOpen, setAttachmentOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  //  RTK Query hook
  const {
    data: tickets,
    isLoading,
    isFetching,
  } = useGetTicketsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

    const [updateTicketStatus, { isLoading: statusUpdating }] =
      useUpdateTicketStatusMutation();

  const columnConfig = {
    ticketId: { label: "Ticket ID" },

    status: {
      label: "Status",
      render: (row) => (
        <button
        disabled={row.status ==="Resolved"}
          onClick={() => openStatusModal(row)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm
      ${
        row.status === "In-Progress"
          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 border cursor-pointer border-purple-300"
          : ""
      }
      ${
        row.status === "On-Hold"
          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border cursor-pointer border-yellow-300"
          : ""
      }
      ${
        row.status === "Resolved"
          ? "bg-green-100 text-green-700 border border-green-300 cursor-not-allowed"
          : ""
      }
    `}
        >
          {row.status}
        </button>
      ),
    },
    ticketType: { label: "Ticket Type" },
    priority: {
      label: "Priority",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold
              ${row.priority === "High" ? "text-red-700" : ""}
              ${row.priority === "Medium" ? "text-yellow-700" : ""}
              ${row.priority === "Low" ? "text-green-700" : ""}
            `}
        >
          {row.priority}
        </span>
      ),
    },
    issueDescription: { label: "Issue Description" },
    attachment: {
      label: "Attachment",
      render: (row) => {
        if (!row.attachment) return "—";

        return row.attachment.type.startsWith("image") ? (
          <button
            onClick={() => {
              setSelectedAttachment(row.attachment);
              setAttachmentOpen(true);
            }}
            className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer"
          >
            <FaImage className="text-green-600 w-4 h-4" />
            <span>Image</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setSelectedAttachment(row.attachment);
              setAttachmentOpen(true);
            }}
            className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer"
          >
            <FaVideo className="text-red-600 w-4 h-4" />
            <span>Video</span>
          </button>
        );
      },
    },
    raisedBy: {
      label: "Raised By",
      render: (row) => {
        const name = row?.raisedBy?.name || "-";
        const role = row?.raisedBy?.role || "-";
        const department = row?.raisedBy?.department || "-";

        if (name === "-" && role === "-" && department === "-") {
          return <span className="text-gray-400 italic">—</span>;
        }

        return (
          <div className="text-sm leading-tight">
            <div className="font-medium text-gray-900 mb-1">{name}</div>
            <div className="text-xs text-gray-600">{role}</div>
            <div className="text-xs text-gray-500">{department}</div>
          </div>
        );
      },
    },

    createdAt: {
      label: "Raised On",
      render: (row) => {
        const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };

        const date = new Date(row.createdAt)
          .toLocaleDateString("en-GB", dateOptions)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");

        const time = new Date(row.createdAt).toLocaleTimeString(
          "en-GB",
          timeOptions
        );

        return (
          <div className="flex flex-col text-xs">
            <span>{date}</span>
            <span className="text-gray-500">{time}</span>
          </div>
        );
      },
    },

    slaTimer: { label: "SLA Timer" },
    resolutionNotes: { label: "Resolution Notes" },
  };

  const columnArray = Object.entries(columnConfig).map(([key, value]) => ({
    key, // <-- ye zaroori hai
    ...value,
  }));

  const statusOptions = ["In-Progress", "On-Hold", "Resolved"];
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  const openStatusModal = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setResolutionNotes(ticket.resolutionNotes);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedTicket(null);
    setNewStatus("");
    setResolutionNotes("");
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await updateTicketStatus({
        id: selectedTicket._id, //  yahan _id use karna hoga, na ki ticketId
        status: newStatus,
        resolutionNotes,
      }).unwrap();

      toast.success(res?.message || "Ticket status updated successfully!");
      closeStatusModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update ticket status");
    }
  };

  return (
    <>
      <PageHeader title="All Assigned Tickets" />

      <div className="mt-4">
        <TechnologyTable
          columnArray={columnArray}
          tableData={tickets?.data}
          total={tickets?.total}
          isLoading={isLoading || isFetching}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={(num) => setCurrentPage(num)}
        />
      </div>

      {openModal && (
        <StatusHistoryModal
          history={selectedHistory}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* image or video show  */}
      {isAttachmentOpen && selectedAttachment && (
        <MediaAttachment
          isOpen={isAttachmentOpen}
          onClose={() => setAttachmentOpen(false)}
          attachment={selectedAttachment}
        />
      )}

      {/* status form modal  */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg p-6 relative">
            <button
              onClick={closeStatusModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-lg font-semibold mb-4 text-orange-500 flex gap-1 items-center">
              <FaTicketAlt size={16} />
              Update Ticket Status
            </h2>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              {/* Status Select */}
              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">-- Select Status --</option>
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-gray-700 mb-1">
                  Resolution Notes
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
                  placeholder="Add notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusUpdating}
                  className={`px-4 py-2 rounded-lg text-white transition-colors duration-200 
                ${
                  statusUpdating
                    ? "bg-orange-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
                >
                  {statusUpdating ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeTicketList;
