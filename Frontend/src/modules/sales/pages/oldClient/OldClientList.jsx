import React, { useState } from "react";
import Table from "../../../../components/Table";
import Loader from "../../../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetClientQuery } from "@/api/sales/client.api";
import RequirementFilesModal from "../../components/RequirementFilesModal";

function OldClientList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileLead, setFileLead] = useState(null);

  const isSalesExecutive =
    user?.designation?.title?.toLowerCase() === "sales executive";

  const params = isSalesExecutive
    ? `leadBy=${user._id}&assignTo=${user._id}&page=${page}&limit=${limit}&match=or`
    : `page=${page}&limit=${limit}`;

  const { data, isLoading, error } = useGetClientQuery({ params });
  console.log("Sales Management Sheet Data:", data);

  // ✅ Corrected
  const clients = data?.data?.clients || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

  const handleView = (item) => {
    navigate(`/sales/old-client/detail/${item?._id}`);
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, item) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleView(item)}
            className="px-1 py-0.5 border border-orange-500 text-orange-500 rounded cursor-pointer"
            title="Detail View"
          >
            <Eye size={20} />
          </button>
        </div>
      ),
    },
    createdAt: {
      label: "Created At",
      render: (val) => new Date(val).toLocaleString("en-IN"),
    },
    clientId: { label: "Client ID" },
    name: { label: "Client Name" },
    phone: { label: "Phone" },
    email: { label: "Email" },
    companyName: { label: "Company Name" },
    businessType: { label: "Business Type" },
    // designation: { label: "Designation" },
    city: { label: "City" },
    pincode: { label: "Pincode" },
    'requirement': {
      label: "Requirement",
      render: (val, row) => {
        // First lead ka requirement show karo (leadData[0])
        const requirement = row?.leadData?.[0]?.requirement || "—";
        const requirementFiles = row?.leadData?.[0]?.requirementFiles || [];

        return (
          <div className="flex items-center justify-center gap-2">
            <span className="truncate max-w-[180px] text-sm text-gray-700">
              {requirement}
            </span>
            {requirementFiles.length > 0 && (
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
        );
      },
    },
    address: { label: "Address" },
    clientRatingInBusiness: { label: "Client Rating" },
    status: { label: "Status" },
  };

  return (
    <div>
      <PageHeader title="Old Client Management" />
      <RequirementFilesModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        lead={fileLead?.leadData?.[0]}
      />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">
          Error loading clients.
        </p>
      ) : (
        <div>
          <Table
            data={clients} // ✅ updated
            columnConfig={columnConfig}
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
}

export default OldClientList;
