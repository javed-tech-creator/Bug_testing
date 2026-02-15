import React, { useEffect, useState } from "react";
import Table from "../../../../components/Table";
import {
  useAssignLeadAcceptedMutation,
  useFetchLeadsByEmployeeIdQuery,
  useFetchLeadsQuery,
} from "../../../../api/sales/lead.api";
import Loader from "../../../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { CircleCheckBig, CirclePlus, Edit, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import RequirementFilesModal from "../../components/RequirementFilesModal";
function AssignLeadList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const isSalesExecutive =
    user?.designation?.title?.toLowerCase() === "sales executive";
  const params = isSalesExecutive
    ? `assignTo=${user._id}&page=${page}&limit=${limit}&match=or`
    : `page=${page}&limit=${limit}`;
  const { data, isLoading, error } = useFetchLeadsQuery({ params });

  const leads = data?.data?.leads || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileLead, setFileLead] = useState(null);


  // const handleUpdate = async (item) => {
  //   const id = item?._id;
  //   const formData = { leadAccept: true };
  //   setLoadingId(id);
  //   try {
  //     const res = await acceptLead({ id, formData }).unwrap();
  //     toast.success("Lead accepted successfully!");
  //   } catch (error) {
  //     toast.error("Failed to accept lead. Please try again.");
  //   } finally {
  //     setLoadingId(null);
  //   }
  // };

  const handleUpdate = (item) => {
    navigate(`/sales/leads/sheet/update/${item?._id}`);
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
        </div>

      ),
    },


    createdAt: {
      label: "Created Date",
      render: (val) => new Date(val).toLocaleString("en-IN"),
    },
    leadStatus: { label: "Status" },
    leadLabel: { label: "Lead Label" },
    clientName: { label: "Concern Person Name" },
    phone: { label: "Phone" },
    email: { label: "Email" },
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
    address: { label: "Address" },
    pincode: { label: "Pin Code" },
    leadSource: { label: "Lead Source" },
    "leadBy.name": { label: "Lead By" }
  };

  return (
    <div className="">
      <RequirementFilesModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        lead={fileLead}
      />

      <PageHeader title="Assign Lead List" />
      <div className="">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 w-full mt-10 text-center">
            Error loading leads.
          </p>
        ) : (
          <Table
            data={leads}
            columnConfig={columnConfig}
            handleUpdate={handleUpdate}
          // handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default AssignLeadList;
