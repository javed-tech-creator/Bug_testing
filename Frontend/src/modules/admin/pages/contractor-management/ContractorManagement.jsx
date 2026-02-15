import PageHeader from "@/components/PageHeader";
import React, { useState } from "react";
import DynamicTableList from "../../components/DynamicTableList";
import { Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllContractorsQuery } from "@/api/admin/contractor-profile-management/contractor.management.api";

const ContractorManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isActive, setIsActive] = useState(null);

  const navigate = useNavigate();

  const handleAdd = () => navigate("/admin/contractor-management/form");

  const handleEdit = (row) => {
    navigate(`/admin/contractor-management/form/${row._id}`);
  };

  const handleView = (row) => {
    navigate(`/admin/contractor-management/profile/${row._id}`);
  };

  const { data, isLoading, isFetching, error } = useGetAllContractorsQuery({
    page: currentPage,
    limit: itemsPerPage,
    isActive: isActive,
  });

  const contractors = data?.data || [];

  // Dummy contractor data
  // const contractors = [
  //   {
  //     contractorId: "CON001",
  //     contactPersonName: "Amit Sharma",
  //     businessName: "Sharma Constructions",
  //     contactNumber: "9876543210",
  //     alternateContact: "9123456780",
  //     city: "Delhi",
  //     state: "Delhi",
  //     isActive: true,
  //   },
  //   {
  //     contractorId: "CON002",
  //     contactPersonName: "Neha Verma",
  //     businessName: "Verma Builders",
  //     contactNumber: "9822113344",
  //     alternateContact: "9090909090",
  //     city: "Mumbai",
  //     state: "Maharashtra",
  //     isActive: false,
  //   },
  //   {
  //     contractorId: "CON003",
  //     contactPersonName: "Ravi Kumar",
  //     businessName: "RK Engineering",
  //     contactNumber: "9988776655",
  //     alternateContact: "9911223344",
  //     city: "Lucknow",
  //     state: "Uttar Pradesh",
  //     isActive: true,
  //   },
  //   {
  //     contractorId: "CON004",
  //     contactPersonName: "Priya Singh",
  //     businessName: "Singh Infra",
  //     contactNumber: "9871234567",
  //     alternateContact: "9812345678",
  //     city: "Jaipur",
  //     state: "Rajasthan",
  //     isActive: false,
  //   },
  // ];

  // Table Columns (updated render functions)
  const contractorColumns = [
    { key: "profileId", label: "Contractor ID" },
    {
      key: "action",
      label: "Action",
      render: (value, row) => (
        <div className="flex items-center gap-3 text-gray-600">
          <button
            onClick={() => handleView(row)}
            className="border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all"
          >
            <Edit size={16} />
          </button>
        </div>
      ),
    },
       {
      key: "isActive",
      label: "Status",
      render: (value, row) => (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    { key: "contactPersonName", label: "Contact Person" },
    { key: "contactNumber", label: "Contact No." },
    { key: "email", label: "Email" },
    { key: "businessName", label: "Business Name" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
 
  ];

  return (
    <div className="p-6 max-w-9xl mx-auto space-y-6">
      <PageHeader
        title="Contractor Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      <DynamicTableList
        columnArray={contractorColumns}
        tableData={contractors}
        total={data?.total}
        isLoading={isLoading || isFetching}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        showActiveFilter={true}
        isActive={isActive}
        setIsActive={setIsActive}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default ContractorManagement;
