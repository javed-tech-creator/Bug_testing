import React, { useEffect, useState } from "react";
import Table from "../../../../components/Table";
import {
  useAssignLeadAcceptedMutation,
  useFetchLeadsByEmployeeIdQuery,
} from "../../../../api/sales/lead.api";
import Loader from "../../../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import isLogin from "../../../../utils/useIsLogin";
import { Spinner } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { CircleCheckBig, CirclePlus } from "lucide-react";
import PageHeader from "../../../../components/PageHeader";
function AssignProjectList() {
  const id = isLogin();
  const [loadingId, setLoadingId] = useState(null);
  const { data, isLoading, error } = useFetchLeadsByEmployeeIdQuery(
    { id },
    { skip: !id }
  );
  const [acceptLead, { isLoading: acceptLoding, error: acceptError }] =
    useAssignLeadAcceptedMutation();
  const leads = data?.data?.result;

  const handleUpdate = async (item) => {
    const id = item?._id;
    const formData = { leadAccept: true };
    setLoadingId(id);
    try {
      const res = await acceptLead({ id, formData }).unwrap();
      toast.success("Lead accepted successfully!");
    } catch (error) {
      toast.error("Failed to accept lead. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

const acceptedLeads = leads?.filter((lead) => {
  const acceptedByFirstEmployee = lead.saleEmployeeId === id;
  const relevantAcceptance = lead.employeeleadsAccept?.[acceptedByFirstEmployee ? 0 : 1];
  return relevantAcceptance?.status === true;
}) || [];


  const columnConfig = {
  actions: {
  label: "Actions",
  render: (val, row) => (
    <div className="flex justify-center gap-3">
  {acceptedLeads?.some(lead => lead._id === row._id) ? (
    <Link
      to={`/sales/leads/sheet/update/${row._id}`}
      className="p-1 tracking-wide rounded flex items-center justify-center border text-green-500"
      title="Update Lead"
    >
      <CirclePlus />
    </Link>
  ) : (
    <button
      onClick={() => handleUpdate(row)}
      className="p-1 tracking-wide rounded flex items-center justify-center border text-orange-500 hover:text-orange-600 transition-all"
      title="Accept"
      disabled={loadingId === row._id}
    >
      {loadingId === row._id ? (
        <Spinner className="h-4 w-4" />
      ) : (
        <CircleCheckBig />
      )}
    </button>
  )}
</div>

  ),
},


    createdAt: {
      label: "Created Date",
      render: (val) => new Date(val).toLocaleString("en-IN"),
    },
    leadStatus: { label: "Status" },
    concernPersonName: { label: "Concern Person Name" },
    phone: { label: "Phone" },
    email: { label: "Email" },
    leadType: { label: "Lead Type" },
    leadSource: { label: "Lead Source" },
    requirement: { label: "Requirement" },
    address: { label: "Address" },
    pincode: { label: "Pin Code" },
  };

  return (
    <div className="">
      <PageHeader title="Assign Project List" />
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

export default AssignProjectList;
