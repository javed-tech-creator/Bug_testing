import PageHeader from "@/components/PageHeader";
import React, { useState } from "react";
import TechnologyTable from "../../components/TechnologyTable";
import { UserCheck } from "lucide-react";
import {
  FaEdit,
  FaImage,
  FaSpinner,
  FaTicketAlt,
  FaUserEdit,
  FaUserPlus,
  FaVideo,
} from "react-icons/fa";
import * as Icons from "lucide-react";
import AssignModal from "../../components/DynamicModalForm";
import {
  useAssignTicketMutation,
  useGetTicketsQuery,
  useUpdateTicketStatusMutation,
} from "@/api/technology/helpdesk.api";
import { toast } from "react-toastify";
import { StatusHistoryModal } from "../../components/helpdesk/StatusHistory";
import { ReassignmentsModal } from "../../components/asset/AssignedModal";
import MediaAttachment from "../../components/helpdesk/MediaAttachment";

const AllTickeLists = () => {
    const [openReassignModal, setOpenReassignModal] = useState(false);
    const [selectedReassignments, setSelectedReassignments] = useState({});
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [isAttachmentOpen, setAttachmentOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [openModal, setOpenModal] = useState(false);
      const [selectedHistory, setSelectedHistory] = useState([]);
        const [isReassignOpen, setReassignOpen] = useState(false);
      



  //  RTK Query hook
  const {
    data: tickets,
    isLoading,
    isFetching,
  } = useGetTicketsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  console.log("Tickets 123:", tickets);
  const [assignTicket, { isLoading: assignLoading }] =
    useAssignTicketMutation();
  const [updateTicketStatus, { isLoading: statusUpdating }] =
    useUpdateTicketStatusMutation();

  const handleAssignSubmit = async (formData) => {
    console.log("formData is 123", formData);

    try {
      const res = await assignTicket({
        id: selectedTicket._id, // ticket jisko assign karna hai
        department: formData.department,
        role: formData.role,
        name: formData.name,
        employeeId: formData.employeeId,
      }).unwrap();

      toast.success(" Ticket assigned successfully!");
      setAssignOpen(false);
          setReassignOpen(false);
    } catch (err) {
      console.error(" Assign failed:", err);
      toast.error(err?.data?.message || " Failed to assign ticket");
    }
  };

  const statusOptions = [
    "In-Progress",
    "On-Hold",
    "Resolved",
  ];
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Dummy dropdowns
  const departments = [
    { _id: "d1", name: "Technology" },
  ];

  const roles = [
    { _id: "r1", name: "Manager", departmentId: "d1" },
    { _id: "r2", name: "Coordinator", departmentId: "d1" },
    { _id: "r3", name: "Engineer", departmentId: "d1" },
  ];

  const employees = [
    { _id: "e1", name: "John Doe", roleId: "r1" },
    { _id: "e2", name: "Jane Smith", roleId: "r1" },
    { _id: "e3", name: "Suresh Kumar", roleId: "r2" },
    { _id: "e4", name: "Rahil Smith", roleId: "r2" },
    { _id: "e5", name: "Rohan Doe", roleId: "r3" },
    { _id: "e6", name: "Aman Kumar", roleId: "r3" },
  ];

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

      toast.success("Ticket status updated successfully!");
      closeStatusModal();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update ticket status");
    }
  };

  const handleAssign = (row) => {
    setSelectedTicket(row);
    setAssignOpen(true);
  };
    const handleReassign = (row) => {
    setSelectedTicket(row);
    setReassignOpen(true);
  };
    const handleOpenReassignments = (row) => {
    setSelectedReassignments(row || {});
    setOpenReassignModal(true);
  };

  const handleCloseReassignments = () => {
    setOpenReassignModal(false);
    setSelectedReassignments({});
  };

  const columnConfig = {
    ticketId: { label: "Ticket ID" },

    actions: {
      label: "Actions",
      render: (row) => {
    const isAssigned = row.assignedTo && row.assignedTo.employeeId;

        return(
        <div className="text-center">
            {!isAssigned ? (
                    <button
                      onClick={() => handleAssign(row)}
                      className="p-2 rounded-full cursor-pointer bg-green-100 text-green-600 hover:bg-green-200 shadow-sm transition-all duration-200"
                      title="Assign Asset"
                    >
                      <FaUserPlus className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReassign(row)}
                      className="p-2 rounded-full cursor-pointer bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm transition-all duration-200"
                      title="Reassign Asset"
                    >
                      <FaUserEdit className="w-4 h-4" />
                    </button>
                  )}
          
        </div>
        );
      },
    },
   
    ticketType: { label: "Ticket Type" },
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
        <div className="font-medium text-gray-900 mb-1">
          {name}
        </div>
        <div className="text-xs text-gray-600">
          {role}
        </div>
        <div className="text-xs text-gray-500">
          {department}
        </div>
      </div>
    );
  }
},

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
 reassignments: {
      label: "Assigned",
      render: (row) => (
        <button
          onClick={() => handleOpenReassignments(row)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group cursor-pointer"
          title="Re-Assigned List"
        >
          <span>View</span>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-black/10 text-blue-600 group-hover:bg-black group-hover:text-white transition-colors">
            ?
          </span>
        </button>
      ),
    },
     createdAt: {
  label: "Raised On",
  render: (row) => {
    const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

    const date = new Date(row.createdAt)
      .toLocaleDateString("en-GB", dateOptions)
      .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");

    const time = new Date(row.createdAt).toLocaleTimeString("en-GB", timeOptions);

    return (
      <div className="flex flex-col text-xs">
        <span>{date}</span>
        <span className="text-gray-500">{time}</span>
      </div>
    );
  },
},
    slaTimer: { label: "SLA Timer" },
 View: { label: "Status History",
        render: (row) => (
        <button
          onClick={() => {
            setSelectedHistory(row.history || []);
            setOpenModal(true);
          }}
          className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
        >
          View
        </button>
      ),
     },
  status: {
      label: "Status",
      render: (row) => (
        <button
        disabled={row.status}
          onClick={() => openStatusModal(row)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-not-allowed duration-200 shadow-sm
      ${
  row.status === "Open"
    ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
    : ""
}
      ${
        row.status === "In-Progress"
          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 border  border-purple-300"
          : ""
      }
      ${
        row.status === "On-Hold"
          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-300"
          : ""
      }
      ${
        row.status === "Resolved"
          ? "bg-green-100 text-green-700 border border-green-300"
          : ""
      }
    `}
        >
          {row.status}
        </button>
      ),
    },

    resolutionNotes: { label: "Resolution Notes" },
  };
  const columnArray = Object.entries(columnConfig).map(([key, value]) => ({
    key, // <-- ye zaroori hai
    ...value,
  }));

  return (
    <div className="">
      <PageHeader
        title="All Tickets" // btnTitle="Add" // path="/tech/tickets-helpdesk/add"
      />

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

      {/* Modal */}
    <AssignModal
  isOpen={isReassignOpen}
  closeModal={() => setReassignOpen(false)}
  type="reassign"
  departments={departments}
          updateLoading={assignLoading}
  roles={roles}
  employees={employees}
  onSubmit={handleAssignSubmit}
/>
          <AssignModal
        isOpen={isAssignOpen}
        closeModal={() => setAssignOpen(false)}
        type="assign"
        departments={departments}
        roles={roles}
        employees={employees}
        updateLoading={assignLoading}
        onSubmit={handleAssignSubmit}
      />

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

      {/* image or video show  */}
      {isAttachmentOpen && selectedAttachment && (
    <MediaAttachment  
        isOpen={isAttachmentOpen}
        onClose={() => setAttachmentOpen(false)}
        attachment={selectedAttachment}/>
      )}


       {openModal && (
        <StatusHistoryModal
          history={selectedHistory}
          onClose={() => setOpenModal(false)}
        />
      )}

        {openReassignModal && (
              <ReassignmentsModal
                open={openReassignModal}
                onClose={handleCloseReassignments}
                data={selectedReassignments}
              />
            )}

    </div>
  );
};

export default AllTickeLists;
