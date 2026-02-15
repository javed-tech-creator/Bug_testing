// FINAL SopList.jsx — Clean UI, File Preview, View/Edit Actions

import React, { useState } from "react";
import Modal from "@/modules/hr/pages/standardOperatingProcedure/components/Modal";
import { useNavigate } from "react-router-dom";
import { Eye, SquarePen } from "lucide-react";
import { useGetAllSopsQuery } from "@/api/hr/employment.api.js";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import Table from "@/components/Table";

const SopList = () => {
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedSop, setSelectedSop] = useState(null);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Fetch All SOPs
  const { data, isLoading, isError } = useGetAllSopsQuery();

  const sops = Array.isArray(data?.data) ? data.data : [];

  // View SOP
  const handleView = (item) => {
    setSelectedSop(item);
    setOpenViewModal(true);
  };
  const closeViewModal = () => {
    setOpenViewModal(false);
    setSelectedSop(null);
  };

  // Edit SOP
  const handleEdit = (item) => {
    if (!item?._id) return;
    navigate(`/hr/sop/edit/${item._id}`);
  };

  /* ----------------------------------------
      COLUMN CONFIGURATION FOR TABLE
  ---------------------------------------- */
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex gap-4 justify-center">
          {/* View Button */}
          <button
            onClick={() => handleView(row)}
            className="text-blue-600 hover:text-blue-800"
            title="View SOP"
          >
            <Eye size={20} />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => handleEdit(row)}
            className="text-orange-600 hover:text-orange-800"
            title="Edit SOP"
          >
            <SquarePen size={20} />
          </button>
        </div>
      ),
    },
    sopId: { label: "SOP ID" },

    title: { label: "Title" },

    description: { label: "Description" },

    designation: {
      label: "Designation",
      render: (val, row) => row?.designationId?.title || "-",
    },

    uploadedBy: {
      label: "Uploaded By",
      render: (val, row) =>
        row?.uploadedByName || row?.uploadedBy?.name || "Admin",
    },
  };

  /* ----------------------------------------
      RENDER SECTION
  ---------------------------------------- */
  return (
    <>
      {openViewModal && (
        <Modal
          isOpen={openViewModal}
          onClose={closeViewModal}
          data={selectedSop}
          mode="view"
        />
      )}

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Title + Add Button */}
          <div className="flex justify-between items-center mb-6">
            <PageHeader
              title="Standard Operating Procedures"
              btnTitle="Add SOP"
              path="/hr/sop/add"
              onClick={() => navigate("/hr/sop/add")}
            />
          </div>

          {/* Loader */}
          {isLoading && <Loader />}

          {/* Error */}
          {isError && (
            <p className="text-center text-red-500 text-lg mt-10">
              ❌ Error loading SOPs. Please try again.
            </p>
          )}

          {/* Empty */}
          {!isLoading && !isError && sops.length === 0 && (
            <p className="text-center text-gray-500 text-lg mt-10">
              No SOPs available.
            </p>
          )}

          {/* Table */}
          {!isLoading && !isError && sops.length > 0 && (
            <Table
              data={sops}
              columnConfig={columnConfig}
              style={{ tableLayout: "fixed", width: "100%" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SopList;
