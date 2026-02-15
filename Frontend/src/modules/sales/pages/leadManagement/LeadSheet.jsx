import React, { useState } from "react";
import Table from "../../../../components/Table";
import {
  useFetchLeadsQuery,
  useUpdateLeadMutation,
} from "../../../../api/sales/lead.api";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "../../../../api/sales/client.api"; // Add this import
import Loader from "../../../../components/Loader";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  Calendar,
  CalendarPlus,
  CircleQuestionMark,
  Eye,
  SquarePen,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ScheduleFollowUpModal from "../../components/leadManagement/ScheduleFollowUpModal";

function LeadSheet() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileLead, setFileLead] = useState(null);

  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [selectedfollowupLead, setSelectedfollowupLead] = useState(null);

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const params =
    user?.designation?.title === "Sales Executive"
      ? `leadBy=${user._id}&assignTo=${user._id}&page=${page}&limit=${limit}&match=or`
      : `&page=${page}&limit=${limit}`;

  const { data, isLoading, error } = useFetchLeadsQuery({ params });
  const leads = data?.data?.leads || [];
  const [updateLead] = useUpdateLeadMutation();
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const navigate = useNavigate();

  const [filterLeadType, setFilterLeadType] = useState("");
  const [filterLeadSource, setFilterLeadSource] = useState("");
  const [filterLeadStatus, setFilterLeadStatus] = useState("");
  const [filterLeadLabel, setFilterLeadLabel] = useState("");
  const unique = (arr) => [...new Set(arr.filter(Boolean))];
  const leadTypes = unique(leads.map((l) => l.leadType));
  const leadSources = unique(leads.map((l) => l.leadSource));
  const leadStatuses = unique(leads.map((l) => l.leadStatus));
  const leadLabels = unique(leads.map((l) => l.leadLabel));
  let filteredLeads = [...leads];

  if (filterLeadType) {
    filteredLeads = filteredLeads.filter(
      (item) => item.leadType === filterLeadType,
    );
  }
  if (filterLeadSource) {
    filteredLeads = filteredLeads.filter(
      (item) => item.leadSource === filterLeadSource,
    );
  }
  if (filterLeadStatus) {
    filteredLeads = filteredLeads.filter(
      (item) => item.leadStatus === filterLeadStatus,
    );
  }
  if (filterLeadLabel) {
    filteredLeads = filteredLeads.filter(
      (item) => item.leadLabel === filterLeadLabel,
    );
  }

  console.log("Filtered Leads:", filteredLeads);

  const handleUpdate = (item) => {
    navigate(`/sales/leads/sheet/update/${item?._id}`);
  };

  const handleInterested = (item) => {
    setSelectedLead(item);
    setStatus("");
    setShowModal(true);
  };

  const handleSubmitStatus = async () => {
    if (!status) return toast.warning("Select a status first");
    if (!selectedLead) return toast.error("No lead selected");
    // if (selectedLead.leadStatus === status) {
    //   toast.info(`Lead is already marked as ${status}`);
    //   return;
    // }
    try {
      // Update lead status
      await updateLead({
        id: selectedLead._id,
        formData: {
          leadStatus: status,
          remark: status === "NOT INTERESTED" ? remark : "",
        },
      }).unwrap();

      toast.success(`Lead marked as ${status}`);
      console.log("Selected Lead:", status);
      if (status === "INTERESTED") {
        const makePassword = () =>
          `DSS@${Math.floor(1000 + Math.random() * 9000)}`;

        const clientData = {
          leadId: [selectedLead._id],
          name: selectedLead.clientName,
          email: selectedLead?.email || null,
          password: makePassword(),
          phone: selectedLead?.phone || null,
          altPhone: selectedLead?.altPhone || null,
          whatsapp: selectedLead?.whatsapp || null,
          companyName: selectedLead?.companyName || "",
          businessType: selectedLead?.businessType || "",
          designation: selectedLead?.designation || "",
          address: selectedLead?.address || "",
          city: selectedLead?.city || "",
          state: selectedLead?.state || "",
          pincode: selectedLead?.pincode || "",
          revenue: "LOW",
          satisfaction: "LOW",
          repeatPotential: "LOW",
          complexity: "LOW",
          engagement: "LOW",
          positiveAttitude: "LOW",
          clientRating: 0,
        };

        if (selectedLead?.leadType === "REPEAT" && selectedLead?.clientId) {
          const updateResult = await updateClient({
            id: selectedLead.clientId,
            formData: clientData,
          }).unwrap();

          if (updateResult.success) {
            toast.success("Client updated successfully!");
            navigate(`/sales/client-overview/${updateResult.data._id}`);
          }
        } else if (selectedLead?.leadType == "FRESH") {
          const clientResult = await createClient({
            formData: clientData,
          }).unwrap();

          if (clientResult.success) {
            toast.success("Client created successfully!");
            navigate(`/sales/client-overview/${clientResult.data._id}`);
          }
        }
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err?.data?.message || "Error updating lead status");
    } finally {
      setShowModal(false);
      setSelectedLead(null);
      setStatus("");
    }
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleUpdate(row)}
            className="px-1 py-0.5 border border-orange-500 text-orange-500 rounded cursor-pointer"
            title="Detail View"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={() => {
              if (row.leadStatus !== "INTERESTED") handleInterested(row);
            }}
            disabled={row.leadStatus === "INTERESTED"}
            className={`cursor-pointer transition-colors 
    ${
      row.leadStatus === "INTERESTED"
        ? "text-gray-400 cursor-not-allowed"
        : "text-orange-500 hover:text-orange-600"
    }`}
            title={
              row.leadStatus === "INTERESTED"
                ? "Already Interested"
                : "View / Interested"
            }
          >
            <CircleQuestionMark size={20} />
          </button>
        </div>
      ),
    },
    // followUp: {
    //   label: "Follow-up",
    //   render: (val, row) => (
    //     <div className="flex justify-center ite">
    //       <button
    //         onClick={() => {
    //           setSelectedfollowupLead(row._id);
    //           setFollowUpModalOpen(true);
    //         }}
    //         className="text-blue-500 hover:text-blue-600 cursor-pointer"
    //         title="Schedule Follow-up"
    //       >
    //         <CalendarPlus size={20} />
    //       </button>
    //     </div>
    //   ),
    // },
    
    followUp: {
      label: "Next Follow-up",
      render: (val, row) => {
        let latestDate = null;

        if (row.followUps?.length > 0) {
          // Get latest by followUpDate
          latestDate = row.followUps.reduce((latest, current) => {
            return new Date(current.followUpDate) >
              new Date(latest.followUpDate)
              ? current
              : latest;
          }).followUpDate;
        }

        const dateObj = latestDate ? new Date(latestDate) : null;

        const formattedDate = dateObj
          ? dateObj.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—";

        const isPast = dateObj && dateObj < new Date();

        return (
          <div className="flex flex-col items-center gap-1">
            {/* Date */}
            <span
              className={`text-xs font-semibold ${
                isPast ? "text-red-500" : "text-gray-700"
              }`}
            >
              {formattedDate}
            </span>

            {/* Button */}
            <button
              onClick={() => {
                setSelectedfollowupLead(row._id);
                setFollowUpModalOpen(true);
              }}
              className="text-blue-500 hover:text-blue-600 cursor-pointer"
              title="Schedule Follow-up"
            >
              <CalendarPlus size={18} />
            </button>
          </div>
        );
      },
    },

    createdAt: {
      label: "Created Date",
      render: (val) => {
        const dateObj = new Date(val);

        const date = dateObj.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        const time = dateObj.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div className="text-center">
            <div className="font-semibold">{date}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        );
      },
    },

    leadStatus: { label: "Status" },
    leadLabel: { label: "Lead Label" },
    contactInfo: {
      label: "Concern Person",
      render: (val, row) => (
        <div className="text-center ">
          <div className="font-semibold text-xs  text-gray-800">
            {row.clientName || "—"}
          </div>
          <div className="text-xs text-gray-600 ">{row.phone || "—"}</div>
          <div className="text-xs text-gray-600">{row.email || "—"}</div>
        </div>
      ),
    },

    leadType: { label: "Lead Type" },
    requirement: {
      label: "Requirement",
      render: (val, row) => (
        <div className="flex items-center justify-center gap-2">
          {/* Requirement text (optional truncate) */}
          <span className="truncate max-w-[180px] text-sm text-gray-700">
            {val || "—"}
          </span>
          {row.requirementFiles?.length > 0 && (
            <button
              onClick={() => {
                setFileLead(row);
                setFileModalOpen(true);
              }}
              title="View Requirement Files"
              className="text-orange-500 hover:text-orange-600 cursor-pointer"
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      ),
    },

    expectedBusiness: { label: "Expected Business" },
    pincode: { label: "Pin Code" },
    leadSource: { label: "Lead Source" },
    "leadBy.name": { label: "Lead By" },
    address: {
      label: "Address",
      render: (val) => (
        <div className="text-center px-2">
          <div className="max-w-[220px] mx-auto text-sm text-gray-700 break-words whitespace-normal">
            {val || "—"}
          </div>
        </div>
      ),
    },
  };

  const getFileType = (url = "") => {
    const ext = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    if (["mp3", "wav", "aac", "m4a"].includes(ext)) return "audio";
    return "document";
  };

  return (
    <div>
      <PageHeader title="Lead Management Sheet" />
      {!isLoading && !error && (
        <div className="w-full mb-2 flex flex-wrap gap-4 bg-white p-2 shadow-xs rounded-lg border">
          {/* Lead Type */}
          <select
            value={filterLeadType}
            onChange={(e) => setFilterLeadType(e.target.value)}
            className="border p-1.5 rounded-md cursor-pointer"
          >
            <option value="">Lead Type</option>
            {leadTypes.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Lead Source */}
          <select
            value={filterLeadSource}
            onChange={(e) => setFilterLeadSource(e.target.value)}
            className="border p-1.5 rounded-md cursor-pointer"
          >
            <option value="">Lead Source</option>
            {leadSources.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Lead Status */}
          <select
            value={filterLeadStatus}
            onChange={(e) => setFilterLeadStatus(e.target.value)}
            className="border p-1.5 rounded-md cursor-pointer"
          >
            <option value="">Lead Status</option>
            {leadStatuses.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Lead Label */}
          <select
            value={filterLeadLabel}
            onChange={(e) => setFilterLeadLabel(e.target.value)}
            className="border p-1.5 rounded-md cursor-pointer"
          >
            <option value="">Lead Label</option>
            {leadLabels.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>

          {/* Reset */}
          <button
            onClick={() => {
              setFilterLeadType("");
              setFilterLeadSource("");
              setFilterLeadStatus("");
              setFilterLeadLabel("");
            }}
            className="px-4 py-1 bg-orange-500 text-white rounded-md cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {fileModalOpen && fileLead && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-4">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">
                Requirement Uploads – {fileLead.clientName}
              </h2>
              <button
                onClick={() => setFileModalOpen(false)}
                className="text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Files */}
            {fileLead.requirementFiles?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-auto">
                {fileLead.requirementFiles.map((file, idx) => {
                  const type = getFileType(file.public_url || file.url);

                  return (
                    <div
                      key={idx}
                      className="border rounded-md p-2 flex flex-col items-center bg-gray-50"
                    >
                      {/* IMAGE */}
                      {type === "image" && (
                        <img
                          src={file.public_url}
                          alt="requirement"
                          className="w-full h-48 object-cover rounded cursor-pointer"
                          onClick={() => window.open(file.public_url, "_blank")}
                        />
                      )}

                      {/* VIDEO */}
                      {type === "video" && (
                        <video
                          controls
                          className="w-full h-48 rounded"
                          src={file.public_url}
                        />
                      )}

                      {/* AUDIO */}
                      {type === "audio" && (
                        <audio controls className="w-full">
                          <source src={file.public_url} />
                        </audio>
                      )}

                      {/* DOCUMENT */}
                      {type === "document" && (
                        <a
                          href={file.public_url}
                          target="_blank"
                          className="text-blue-600 underline text-sm mt-2"
                        >
                          📄 Open Document
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No requirement files uploaded.
              </p>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-orange-500 w-full mt-10 text-center">
          Error loading leads.
        </p>
      ) : (
        <Table
          key={filteredLeads.length}
          data={filteredLeads}
          columnConfig={columnConfig}
        />
      )}

      {/* MODAL */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 transform transition-all">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-black">
                !! Lead Details !!
              </h2>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">Name:</span>
                <span className="text-gray-700">{selectedLead.clientName}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">Phone:</span>
                <span className="text-gray-700">{selectedLead.phone}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">Email:</span>
                <span className="text-gray-700">{selectedLead.email}</span>
              </div>
              {/* <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">
                  Requirement:
                </span>
                <span className="text-gray-700">
                  {selectedLead.requirement}
                </span>
              </div> */}
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">
                  Expected Business:
                </span>
                <span className="text-gray-700">
                  {selectedLead.expectedBusiness}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">
                Client Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-2 text-base bg-white text-black	cursor-pointer"
              >
                <option value="" disabled>
                  -- Select Status --
                </option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="NOT INTERESTED">NOT INTERESTED</option>
              </select>
            </div>

            {/* REMARK TEXTAREA SHOW ONLY WHEN "NOT INTERESTED" */}
            {status === "NOT INTERESTED" && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-black mb-2">
                  Remark
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={2}
                  className="w-full border-2 border-gray-300 rounded-lg p-2 text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white text-black"
                  placeholder="Write reason here..."
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 cursor-pointer bg-white border-2 border-gray-300 text-black font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitStatus}
                className="px-4 py-1.5 cursor-pointer bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* follow-up modal  */}
      {followUpModalOpen && (
        <ScheduleFollowUpModal
          isOpen={followUpModalOpen}
          onClose={() => {
            setFollowUpModalOpen(false);
            setSelectedfollowupLead(null);
          }}
          lead={selectedfollowupLead}
        />
      )}
    </div>
  );
}

export default LeadSheet;
