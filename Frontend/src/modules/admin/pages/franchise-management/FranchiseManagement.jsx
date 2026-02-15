import React, { useState } from "react";
import { Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import DynamicTableList from "../../components/DynamicTableList";
import { useGetAllFranchisesQuery } from "@/api/admin/franchise-profile-management/franchise.management.api";

const FranchiseManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isActive, setIsActive] = useState(null); //  controlled state for filter
  const navigate = useNavigate();

  const handleAdd = () => navigate("/admin/franchise-management/form");

  const { data, isLoading, isFetching, error } = useGetAllFranchisesQuery({
    page: currentPage,
    limit: itemsPerPage,
    isActive,
  });

  const franchises = data?.data || [];

  const handleEdit = (row) => {
    navigate(`/admin/franchise-management/form/${row._id}`);
  };

  const handleView = (row) => {
    console.log("franchise details", row);

    navigate(`/admin/franchise-management/profile/${row._id}`);
  };

  const franchiseColumns = [
    { key: "profileId", label: "Franchise ID" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleView(row)}
            className="border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg transition-all duration-200 cursor-pointer"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all"
            title="Edit Franchise"
          >
            <Edit size={18} />
          </button>
        </div>
      ),
    },
        {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "contactPersonName", label: "Contact Person" },
    { key: "contactNumber", label: "Contact Number" },
    { key: "email", label: "Email" },
    { key: "businessName", label: "Business Name" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },

  ];

  return (
    <div className="p-6 max-w-9xl mx-auto space-y-6">
      <PageHeader
        title="Franchise Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      <DynamicTableList
        columnArray={franchiseColumns}
        tableData={franchises}
        total={data?.total}
        isLoading={isLoading || isFetching}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        showActiveFilter={true} //  enable here only
        isActive={isActive}
        setIsActive={setIsActive}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default FranchiseManagement;
