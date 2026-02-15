import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import TechnologyTable from "@/modules/technology/components/TechnologyTable";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import {
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
  useUpdateCampaignStatusMutation,
} from "@/api/marketing/campaignManagement.api";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import { toast } from "react-toastify";

const CampaignManagement = () => {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedStatusHistory, setSelectedStatusHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data,
    isLoading: loadingCampaign,
    error,
  } = useGetCampaignsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteCampaign, { isLoading: deleteLoading }] =
    useDeleteCampaignMutation();
  const [updateCampaignStatus, { isLoading }] =
    useUpdateCampaignStatusMutation();

  console.log("campaign data is", data);

  const navigate = useNavigate();
  // Dummy Column Config
  const columnArray = [
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            onClick={() => Edit(row)}
            className="p-2 rounded-full cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm transition-all duration-200"
            title="Edit Campaign"
          >
            <FaEdit className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={() => handleDelete(row)}
            className="p-2 rounded-full cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-all duration-200"
            title="Delete Campaign"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
      {
      key: "campaign_id",
      label: "Campaign ID",
      render: (row)=> row?.campaign_id || "—",
    },
    {
      key: "campaignName",
      label: "Campaign Name",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const status = row.status || "Draft"; // default
        let bgColor = "";
        let textColor = "";

        switch (status) {
          case "Draft":
            bgColor = "bg-gray-100";
            textColor = "text-gray-800";
            break;
          case "Scheduled":
            bgColor = "bg-blue-100";
            textColor = "text-blue-800";
            break;
          case "Running":
            bgColor = "bg-green-100";
            textColor = "text-green-800";
            break;
          case "Paused":
            bgColor = "bg-yellow-100";
            textColor = "text-yellow-800";
            break;
          case "Completed":
            bgColor = "bg-purple-100";
            textColor = "text-purple-800";
            break;
          case "Cancelled":
            bgColor = "bg-red-100";
            textColor = "text-red-800";
            break;
          case "Failed":
            bgColor = "bg-red-200";
            textColor = "text-red-900";
            break;
          default:
            bgColor = "bg-gray-100";
            textColor = "text-gray-800";
        }

        return (
          <button
            onClick={() => openStatusModal(row)}
            disabled={status === "Completed"}
            className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-all duration-200 ${bgColor} ${textColor}
    ${
      status === "Completed"
        ? `cursor-not-allowed`
        : `cursor-pointer hover:shadow-md hover:scale-105`
    }`}
          >
            {status}
          </button>
        );
      },
    },

    {
      key: "statusHistory",
      label: "Status History",
      render: (row) => (
        <button
          onClick={() => openStatusHistoryModal(row.statusHistory)}
          className="px-3 py-1 rounded-full text-sm font-medium  text-blue-600 hover:underline hover:text-blue-800 cursor-pointer transition-all duration-200"
        >
          View
        </button>
      ),
    },

    {
      key: "landingPage",
      label: "Landing Page",
      render: (row) => {
        if (!row.landingPage) return "—";
        return (
          <Link
            to={row.landingPage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline hover:text-blue-800"
          >
            Link
          </Link>
        );
      },
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "platform",
      label: "Platform",
    },
    {
      key: "objective",
      label: "Objective",
    },
    {
      key: "region",
      label: "Region",
      render: (row) => row?.targetAudience?.region || "—",
    },
    {
      key: "budget",
      label: "Budget",
      render: (row) =>
        row.budget ? `₹${row.budget.toLocaleString("en-IN")}` : "—",
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (row) => {
        if (!row.startDate) return "—";
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.startDate)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },
    {
      key: "endDate",
      label: "End Date",
      render: (row) => {
        if (!row.endDate) return "—";
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.endDate)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },
    {
      key: "createdBy",
      label: "Created By",
      render: (row) => row?.createdBy?.name || "—",
    },
    {
      key: "demographics",
      label: "Demographics",
      render: (row) => row?.targetAudience?.demographics || "—",
    },
    {
      key: "interests",
      label: "Interests",
      render: (row) =>
        row?.targetAudience?.interests?.length
          ? row.targetAudience.interests.join(", ")
          : "—",
    },

    {
      key: "createdAt",
      label: "Created At",
      render: (row) => {
        if (!row.createdAt) return "—";
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.createdAt)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },
  ];

  const openStatusHistoryModal = (history) => {
    setSelectedStatusHistory(history);
    setIsHistoryModalOpen(true);
  };

  const openStatusModal = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedStatus(campaign.status);
    setIsModalOpen(true);
  };

  const handleSaveStatus = async () => {
    try {
      const result = await updateCampaignStatus({
        id: selectedCampaign._id,
        status: selectedStatus,
      }).unwrap();
      // toast or notification
      if (result.success) {
        toast.success(result.message || "Status Update successfully!");
      } else {
        toast.warn(result.message || "Status Update Failed!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Status Update Failed");
    } finally {
      setSelectedCampaign(null);
      setSelectedStatus("");
      setIsModalOpen(false);
    }
  };

  const handleDelete = (row) => {
    setDeleteTarget(row); // kis asset ko delete karna hai
    setOpenDialog(true); // confirm dialog open karo
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      const result = await deleteCampaign(deleteTarget._id).unwrap();
      if (result?.success) {
        toast.success(result.message || "Campaign deleted successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete Campaign.");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  const Edit = (row) => {
    console.log("Edit ID:", row);
    // confirm modal + API call lagao
    navigate("/marketing/campaigns/form", {
      state: {
        campaignData: row,
      },
    });
  };

  const groupByDate = (history) => {
    return history.reduce((acc, item) => {
      const dateObj = new Date(item.updatedAt);
      const date = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };
  const groupedHistory = groupByDate([...selectedStatusHistory].reverse());

  return (
    <div>
      <PageHeader
        title="Campaign Management"
        path="/marketing/campaigns/form"
        btnTitle="Add"
      />

      <div className="mt-4">
        <TechnologyTable
          columnArray={columnArray}
          tableData={data?.campaigns}
          total={data?.totalCampaigns}
          isLoading={loadingCampaign}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* delete  */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete this Campaign?`}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
        onCancel={() => setOpenDialog(false)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <FaEdit className="text-orange-500 text-xl" />
              <h2 className="text-lg font-semibold text-gray-800">
                Update Campaign Status
              </h2>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              {[
                "Running",
                "Paused",
                "Scheduled",
                "Completed",
                "Cancelled",
                "Failed",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={
                  isLoading || selectedCampaign.status === selectedStatus
                }
                className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200  ${
                  isLoading || selectedCampaign.status === selectedStatus
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin text-white" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl p-5 w-[52rem] max-h-[80vh] shadow-xl border border-gray-200 flex flex-col">
            {/* Header */}
            <h2 className="text-xl font-semibold mb-4 pb-3 border-b border-gray-200 text-gray-800">
              Status History
            </h2>

            {/* Table Section */}
            {Object.entries(groupedHistory).length ? (
              <div className="flex-1 overflow-y-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 bg-gray-50 z-10 border-b-1">
                    <tr>
                      <th className="text-left py-2.5 px-4 font-medium text-gray-700 uppercase tracking-wide text-xs">
                        Date
                      </th>
                      <th className="text-left py-2.5 px-4 font-medium text-gray-700 uppercase tracking-wide text-xs">
                        Status
                      </th>
                      <th className="text-left py-2.5 px-4 font-medium text-gray-700 uppercase tracking-wide text-xs">
                        Time
                      </th>
                      <th className="text-left py-2.5 px-4 font-medium text-gray-700 uppercase tracking-wide text-xs">
                        Updated By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedHistory).map(([date, updates]) => (
                      <React.Fragment key={date}>
                        {updates.map((s, index) => {
                          let bgColor = "",
                            textColor = "",
                            borderColor = "";
                          switch (s.status) {
                            case "Draft":
                              bgColor = "bg-gray-50";
                              textColor = "text-gray-700";
                              borderColor = "border-gray-200";
                              break;
                            case "Scheduled":
                              bgColor = "bg-blue-50";
                              textColor = "text-blue-700";
                              borderColor = "border-blue-200";
                              break;
                            case "Running":
                              bgColor = "bg-green-50";
                              textColor = "text-green-700";
                              borderColor = "border-green-200";
                              break;
                            case "Paused":
                              bgColor = "bg-yellow-50";
                              textColor = "text-yellow-700";
                              borderColor = "border-yellow-200";
                              break;
                            case "Completed":
                              bgColor = "bg-purple-50";
                              textColor = "text-purple-700";
                              borderColor = "border-purple-200";
                              break;
                            case "Cancelled":
                              bgColor = "bg-red-50";
                              textColor = "text-red-700";
                              borderColor = "border-red-200";
                              break;
                            case "Failed":
                              bgColor = "bg-red-100";
                              textColor = "text-red-800";
                              borderColor = "border-red-300";
                              break;
                            default:
                              bgColor = "bg-gray-50";
                              textColor = "text-gray-700";
                              borderColor = "border-gray-200";
                          }

                          const dateObj = new Date(s.updatedAt);
                          const time = dateObj.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <tr
                              key={s._id}
                              className="border-b border-gray-200 hover:bg-gray-50 "
                            >
                              {/* Date Column - render only for first row */}
                              {index === 0 && (
                                <td
                                  rowSpan={updates.length}
                                  className="px-6 py-4 font-semibold text-gray-800 border-r border-gray-300 align-center bg-gray-50"
                                >
                                  {date}
                                </td>
                              )}

                              {/* Status */}
                              <td className="py-4 px-6 ">
                                <span
                                  className={`px-3 py-1 rounded-md text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}
                                >
                                  {s.status}
                                </span>
                              </td>

                              {/* Time */}
                              <td className="py-4 px-6 text-gray-700 font-mono text-sm">
                                {time}
                              </td>

                              {/* Updated By */}
                              <td className="py-4 px-6">
                                <div className="flex flex-col">
                                  <span className="text-gray-800 text-sm font-medium">
                                    {s.updatedBy?.name}
                                  </span>
                                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                                    {s.updatedBy?.role}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 flex-1 flex items-center justify-center">
                <div>
                  <div className="text-gray-400 text-5xl mb-3">📋</div>
                  <p className="text-gray-500 text-base">
                    No status history available
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end mt-5 pt-3 border-t border-gray-200">
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-all border border-gray-200 hover:border-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagement;
