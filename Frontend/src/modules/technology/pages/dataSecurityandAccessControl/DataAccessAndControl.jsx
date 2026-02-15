import PageHeader from "@/components/PageHeader";
import React, { useState } from "react";
import TechnologyTable from "../../components/TechnologyTable";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Lock, LockOpen } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import {
  useDeleteAccessMutation,
  useGetAccessRecordsQuery,
  useRevokeAccessMutation,
} from "@/api/technology/dataAccessControl.api";
import { toast } from "react-toastify";

const DataAccessAndControl = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Modal states
  const [selectedRow, setSelectedRow] = useState(null);
  const [revokeDate, setRevokeDate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openActivation, setOpenActivation] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data: accessData,
    isLoading,
    isFetching,
  } = useGetAccessRecordsQuery({ page: currentPage, limit: itemsPerPage });
  console.log("data is", accessData);
  const [deleteAccess, { isLoading: deleteLoading }] =
    useDeleteAccessMutation();

  const [revokeAccess, { isLoading: revokeLoading }] =
    useRevokeAccessMutation();

  const handleDelete = (row) => {
    setDeleteTarget(row); // kis asset ko delete karna hai
    setOpenDialog(true); // confirm dialog open karo
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      const result = await deleteAccess(deleteTarget._id).unwrap();
      if (result?.success) {
        toast.success("Deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete.");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  //  Handle Status Toggle
  const handleStatusToggle = (row) => {
    if (!row.accessRevoked) {
      //  Active → open revoke date modal
      setSelectedRow(row);
      setShowRevokeModal(true); // apna date input modal
    } else {
      //  Inactive → open confirm dialog
      setSelectedRow(row); // yaha sirf dialog ke liye row set karenge
      setOpenActivation(true);
    }
  };

const confirmReactivate = async () => {
  if (!selectedRow) return;
  try {
    const res = await revokeAccess({
      id: selectedRow._id,
      accessRevoked: null, //  null bhejne se backend status Active kar dega
    }).unwrap();

    if (res.success) {
      toast.success(" Access re-activated successfully!");
    }
  } catch (err) {
    console.error("Reactivate error:", err);
    toast.error(err?.data?.message || "Failed to re-activate access");
  } finally {
    setOpenActivation(false); //  sahi dialog close
    setSelectedRow(null); //  row reset
  }
};


  //  Submit revoke date
  const submitRevoke = async () => {
    if (!selectedRow || !revokeDate) return;
    try {
      const res = await revokeAccess({
        id: selectedRow._id,
        accessRevoked: revokeDate,
      }).unwrap();

      if (res.success) {
        toast.success("Access revoked successfully!");
        setSelectedRow(null);
        setRevokeDate("");
        //  state ko refresh karne ki zarurat nahi, RTK cache auto-update karega
      }
    } catch (err) {
      console.error("Revoke error:", err);
      toast.error(err?.data?.message || "Failed to revoke access");
    }
  };

  const employeeAccessColumnConfig = [
    {
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-full cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm transition-all duration-200"
            title="Edit Asset"
          >
            <FaEdit className="w-3.5 h-3.5" />
          </button>
          {/* Delete */}
          <button
            onClick={() => handleDelete(row)}
            className="p-2 rounded-full cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-all duration-200"
            title="Delete Asset"
          >
            <FaTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
    {
      label: "Access Status",
      key: "accessStatus",
      render: (row) => (
        <button
          onClick={() => handleStatusToggle(row)}
          className="flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition-all text-sm"
        >
          {row.accessRevoked ? (
            <span className="flex items-center gap-1 text-red-500">
              <Lock className="w-4 h-4" /> Inactive
            </span>
          ) : (
            <span className="flex items-center gap-1 text-green-600">
              <LockOpen className="w-4 h-4" /> Active
            </span>
          )}
        </button>
      ),
    },
    { label: "Employee ID", key: "employeeId" },
    {
      label: "System Access",
      key: "systemAccess",
      render: (row) =>
        Array.isArray(row.systemAccess) && row.systemAccess.length > 0
          ? row.systemAccess.join(", ")
          : "-",
    },
    { label: "Permissions / Roles", key: "role" },
    { label: "Device Binding", key: "deviceBinding" },
    { label: "login History", key: "loginHistory" },
    {
      label: "Access Revoked",
      key: "accessRevoked",
      render: (row) => {
        if (!row.accessRevoked) return "-";

        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(row.accessRevoked)
          .toLocaleDateString("en-GB", options)
          .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");
      },
    },
  ];

  const navigate = useNavigate();
  const handleEdit = (row) => {
    navigate("/tech/data-access-control/add", {
      state: {
        AccessControlData: row,
      },
    });
  };

  return (
    <div className="">
      <PageHeader
        title="Data Security & Access Control "
        btnTitle="Add"
        path="/tech/data-access-control/add"
      />

      <div className="mt-4">
        {/* <Table onEdit={handleEdit} onDelete={handleDelete} data={licenseData} columnConfig={columnConfig} /> */}
        <TechnologyTable
          columnArray={employeeAccessColumnConfig}
          tableData={accessData?.data}
          total={accessData?.total}
          isLoading={isLoading || isFetching}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/*  Modal for revoke date */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Revoke Access for {selectedRow.employeeId}
            </h3>
            <input
              type="date"
              value={revokeDate}
              onChange={(e) => setRevokeDate(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedRow(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                disabled={revokeLoading}
                onClick={submitRevoke}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {revokeLoading ? <FaSpinner className="animate-spin" /> : "Revoke"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 ConfirmDialog for re-activate */}
      <ConfirmDialog
        open={openActivation}
        title="Confirm Reactivation"
        message={`Are you sure you want to re-activate access for ${selectedRow?.employeeId}?`}
        isLoading={revokeLoading}
        onConfirm={confirmReactivate}
        onCancel={() => {
          setOpenActivation(false);
          setSelectedRow(null); //  cancel karte hi clear karo
        }}
      />

      {/* delete  */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete this?`}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default DataAccessAndControl;
