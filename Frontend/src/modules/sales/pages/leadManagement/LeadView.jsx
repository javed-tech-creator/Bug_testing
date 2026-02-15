import React, { useState } from "react";
import Table from "../../../../components/Table";
import { useFetchLeadsQuery } from "../../../../api/sales/lead.api";
import Loader from "../../../../components/Loader";
import { useNavigate } from "react-router-dom";
import { SquarePen } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { MdAssignment, MdAssignmentTurnedIn } from "react-icons/md";
import { FaUserPlus,FaUsers  } from "react-icons/fa";
import { useSelector } from "react-redux";
function LeadView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const params =
    user.designation === "Sales Executive"
      ? `?assignTo=${user._id}&page=${page}&limit=${limit}`
      : `?page=${page}&limit=${limit}`;
  const { data, isLoading, error } = useFetchLeadsQuery({ params });

  const leads = data?.data?.leads || [];
  console.log(data);
  const navigate = useNavigate();
  const handleUpdate = (item) => {
    console.log("Update clicked", item);
  };

  const handleDelete = (item) => {
    console.log("Delete clicked", item);
  };

  const handleAssign = (item) => {
    const id = item._id;
    navigate(`/sales/leads/assign/${id}`);
    console.log("Update clicked", item);
  };

  const handleReAssign = (item) => {
    const id = item._id;
    navigate(`/sales/leads/assign/${id}`);
    console.log("Update re Assign", item);
  };

  const handleEdit = (item) => {
    navigate(`/sales/leads/add`, { state: { leadData: item } });
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-3">
          {row?.isAssign && (
            <button
              onClick={() => handleAssign(row)}
              className="text-orange-500 cursor-pointer"
              title="Reassign"
            >
              <FaUserPlus size={24} />
            </button>
          )}
          {!row?.isAssign && (
            <button
              onClick={() => handleReAssign(row)}
              className="text-orange-500 cursor-pointer"
              title="Assign"
            >
              <FaUsers size={24} />
            </button>
          )}
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-orange-500 rounded cursor-pointer"
            title="Edit"
          >
            <SquarePen size={20} />
          </button>
        </div>
      ),
    },
    createdAt: {
      label: "Created Date",
      render: (val) => new Date(val).toLocaleString("en-IN"),
    },
    leadStatus: { label: "Status" },
    clientName: { label: "Concern Person Name" },
    phone: { label: "Phone" },
    email: { label: "Email" },
    leadType: { label: "Lead Type" },
    leadSource: { label: "Lead Source" },
    requirement: { label: "Requirement" },
    expectedBusiness: { label: "Expected Business" },
    address: { label: "Address" },
    pincode: { label: "Pin Code" },
    "assignTo[0].userId.name": { label: "Assigned Excutive 1" },
    "assignTo[1].userId.name": { label: "Assigned Excutive 2" },
  };

  return (
    <div className="">
      <PageHeader title="Total Leads" />

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

export default LeadView;
