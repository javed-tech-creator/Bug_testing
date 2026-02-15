import React, { useMemo, useState } from "react";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import {
  useGetAllRecceQuery,
  useGetRecceDetailByIdQuery,
} from "@/api/recce/reccedetail.api";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompletedRecce = () => {
  const navigate = useNavigate();
  // Fetch all recce data
  const { data, isLoading } = useGetAllRecceQuery();

  // Filter only completed recce
  const completedData = useMemo(() => {
    return (
      data?.data?.filter((item) => {
        const status = item?.reviewSubmit?.status?.toLowerCase();
        return (
          status === "completed" ||
          status === "approved" ||
          status === "submitted"
        );
      }) || []
    );
  }, [data]);

  const handleViewClick = (recceId) => {
    navigate(`/recce/${recceId}`);
  };

  const columnConfig = {
    client: { label: "Client" },
    project: { label: "Project" },
    address: { label: "Address" },
    status: {
      label: "Status",
      render: () => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-600 border-green-100">
          Completed
        </span>
      ),
    },
    actions: {
      label: "Actions",
      render: (value, row) => (
        <button
          className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
          onClick={() => handleViewClick(row._id)}
          title="View Details"
        >
          <Eye size={16} strokeWidth={2} />
        </button>
      ),
    },
  };

  // Format data for table
  const formattedData = completedData.map((item) => ({
    _id: item._id,
    client: item?.clientId?.name || "N/A",
    project: item?.projectName || "N/A",
    address: item?.address || "N/A",
    status: item?.reviewSubmit?.status || "N/A",
    actions: "",
  }));

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <PageHeader title="Completed Recce" />
      </div>
      {isLoading ? (
        <div className="text-center py-10">Loading completed recce...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table data={formattedData} columnConfig={columnConfig} />
          </div>
        </div>
      )}

      {/* Modal for recce detail */}
    </div>
  );
};

export default CompletedRecce;
