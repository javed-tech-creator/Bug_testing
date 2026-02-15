import React, { useState } from "react";
import { Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import DynamicTableList from "../../components/DynamicTableList";
import { useGetAllVendorsQuery } from "@/api/admin/vendor-profile-management/vendor.management.api";

const VendorManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isActive, setIsActive] = useState(null); //  controlled state for filter
  const navigate = useNavigate();

  const handleAdd = () => navigate("/admin/vendor-management/form");

  const { data, isLoading, isFetching, error } = useGetAllVendorsQuery({
    page: currentPage,
    limit: itemsPerPage,
    isActive,
  });

  const vendors = data?.data || [];

  const handleEdit = (row) => {
    navigate(`/admin/vendor-management/form/${row._id}`);
  };

  const handleView = (row) => {
    console.log("vendor ddetails", row);

    navigate(`/admin/vendor-management/profile/${row._id}`);
  };

  const vendorColumns = [
    { key: "profileId", label: "Vendor ID" },
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
            title="Edit Vendor"
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
        title="Vendor Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      <DynamicTableList
        columnArray={vendorColumns}
        tableData={vendors}
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

export default VendorManagement;
