import React, { useEffect, useState } from "react";
import Table from "@/components/Table";
import PageHeader from "@/components/PageHeader";
import { FaEdit, FaTrash, FaUserEdit, FaUserPlus } from "react-icons/fa";
import TechnologyTable from "../../components/TechnologyTable";
import { useNavigate } from "react-router-dom";

import AssignModal from "../../components/DynamicModalForm";
import {
  useDeleteAssetMutation,
  useGetAssetsQuery,
  usePatchAssetMutation,
} from "@/api/technology/assetManagement.api";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import { ReassignmentsModal } from "../../components/asset/AssignedModal";

function AllAssetList() {
  const [openReassignModal, setOpenReassignModal] = useState(false);
  const [selectedReassignments, setSelectedReassignments] = useState({});
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [isReassignOpen, setReassignOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: assets,
    isLoading: getAssetLoading,
    isFetching: getAssetFetching,
  } = useGetAssetsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  console.log("assetData is..", assets);
  const [patchAsset, { isLoading: patchLoading }] = usePatchAssetMutation();
  const [deleteAsset, { isLoading: deleteLoading }] = useDeleteAssetMutation();

  const navigate = useNavigate();

  // Dummy dropdowns
  const departments = [
    { _id: "d1", name: "IT" },
    { _id: "d2", name: "Finance" },
  ];

  const roles = [
    { _id: "r1", name: "Manager", departmentId: "d1" },
    { _id: "r2", name: "Technician", departmentId: "d1" },
    { _id: "r3", name: "Admin", departmentId: "d2" },
  ];

  const employees = [
    { _id: "e1", name: "John Doe", roleId: "r1" },
    { _id: "e2", name: "Jane Smith", roleId: "r2" },
    { _id: "e3", name: "Suresh Kumar", roleId: "r3" },
  ];

  const handleOpenReassignments = (row) => {
    setSelectedReassignments(row || {});
    setOpenReassignModal(true);
  };

  const handleCloseReassignments = () => {
    setOpenReassignModal(false);
    setSelectedReassignments({});
  };

  const handleAssign = (row) => {
    setSelectedAsset(row);
    setAssignOpen(true);
  };

  const handleReassign = (row) => {
    setSelectedAsset(row);
    setReassignOpen(true);
  };

  const handleAssignSubmit = async (formData, type) => {
    console.log("formdata is", formData);

    try {
      if (!selectedAsset?._id) return;

      const result = await patchAsset({
        id: selectedAsset._id,
        ...formData, // department, role, employee
      }).unwrap();

      if (result?.success) {
        if (type === "assign") {
          toast.success("Asset assigned successfully!");
        } else if (type === "reassign") {
          toast.success("Asset reassigned successfully!");
        }

        setAssignOpen(false);
        setReassignOpen(false);
      }w
    } catch (error) {
      console.error("Assign error:", error);
      toast.error(error?.data?.message || "Failed to process asset.");
    }
  };

  const handleDelete = (row) => {
    setDeleteTarget(row); // kis asset ko delete karna hai
    setOpenDialog(true); // confirm dialog open karo
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      const result = await deleteAsset(deleteTarget._id).unwrap();
      if (result?.success) {
        toast.success("Asset deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete asset.");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  const Edit = (row) => {
    console.log("Edit ID:", row);
    // confirm modal + API call lagao
    navigate("/tech/assets/add", {
      state: {
        assetData: row,
      },
    });
  };

  // Table column config
  const columnConfig = {
    // Actions Column
   actions: {
  label: "Actions",
  render: (row) => {
    // Agar asset pe assignedTo object hai to iska matlab assigned hai
    const isAssigned = row.assignedTo && row.assignedTo.employeeId;

    return (
      <div className="flex items-center gap-2">
        {/* Edit */}
        <button
          onClick={() => Edit(row)}
          className="p-2 rounded-full cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm transition-all duration-200"
          title="Edit Asset"
        >
          <FaEdit className="w-3.5 h-3.5" />
        </button>

        {/* Conditional Assign / Reassign */}
        {!isAssigned ? (
          <button
            onClick={() => handleAssign(row)}
            className="p-2 rounded-full cursor-pointer bg-green-100 text-green-600 hover:bg-green-200 shadow-sm transition-all duration-200"
            title="Assign Asset"
          >
            <FaUserPlus className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => handleReassign(row)}
            className="p-2 rounded-full cursor-pointer bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm transition-all duration-200"
            title="Reassign Asset"
          >
            <FaUserEdit className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete */}
        <button
          onClick={() => handleDelete(row)}
          className="p-2 rounded-full cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-all duration-200"
          title="Delete Asset"
        >
          <FaTrash className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  },
},

    tag: { label: "Tag" },
    type: { label: "Type" },
    brand: { label: "Brand" },
    model: { label: "Model" },
    location: { label: "Location" },
    status: { label: "Status" },
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

    purchase_date: {
      label: "Purchase Date",
      render: (row) => {
        if (!row.purchase_date) return "-";

        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.purchase_date)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },

    warranty_end: {
      label: "Warranty End",
      render: (row) => {
        if (!row.warranty_end) return "-";

        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.warranty_end)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },
      expireIn: {
      label: "Expire In",

     render: (row) => {
  if (!row.expireIn) return null; // safeguard

  // Check if it's expired or has days left
  const isExpired = row.expireIn.toLowerCase() === "expired";

  return (
    <span
      style={{
        color: isExpired ? "red" : "green",
        fontWeight: 600,
      }}
    >
      {row.expireIn}
    </span>
  );
},

    },
    vendor_name: { label: "Vendor" },

    // AMC Contract field
    amc_contract: {
      label: "AMC Contract",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.amc_contract === "Yes"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {row.amc_contract || "-"}
        </span>
      ),
    },

    // Contract Number
    contract_no: {
      label: "AMC Contract No.",
      render: (row) => (row.contract_no ? row.contract_no : "-"),
    },

    // Validity
    validity: {
      label: "AMC Validity",

      render: (row) => {
        if (!row.validity) return "-";

        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.validity)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },

    created_at: {
      label: "Created At",
      render: (row) => {
        if (!row.createdAt) return "-";

        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.createdAt)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },
  };

  const columnArray = Object.entries(columnConfig).map(([key, value]) => ({
    key, // <-- ye zaroori hai
    ...value,
  }));

  return (
    <>
      <div className="">
        <PageHeader title="All Assets" btnTitle="Add" path="/tech/assets/add" />

        <div className="mt-4">
          <TechnologyTable
            columnArray={columnArray}
            tableData={assets?.data}
            total={assets?.total}
            isLoading={getAssetLoading || getAssetFetching}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      <AssignModal
        isOpen={isAssignOpen}
        closeModal={() => setAssignOpen(false)}
        type="assign"
        departments={departments}
        roles={roles}
        employees={employees}
        isLoading={patchLoading}
        onSubmit={handleAssignSubmit}
      />

      <AssignModal
        isOpen={isReassignOpen}
        closeModal={() => setReassignOpen(false)}
        type="reassign"
        departments={departments}
        isLoading={patchLoading}
        roles={roles}
        employees={employees}
        onSubmit={handleAssignSubmit}
      />

      {/* delete  */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete this asset?`}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
        onCancel={() => setOpenDialog(false)}
      />

      {openReassignModal && (
        <ReassignmentsModal
          open={openReassignModal}
          onClose={handleCloseReassignments}
          data={selectedReassignments}
        />
      )}
    </>
  );
}

export default AllAssetList;
