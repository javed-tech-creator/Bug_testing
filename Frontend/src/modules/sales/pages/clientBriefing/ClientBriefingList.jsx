import React from "react";
import Table from "../../../../components/Table";
import Loader from "../../../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { useGetProjectQuery } from "../../../../api/sales/sales.api";

function ClientBriefing() {
  const { data, isLoading, error } = useGetProjectQuery();
  const leads = data?.data?.result;
  console.log(leads);
  const columnConfig = {
    timestamp: {
      label: "Client Briefing time",
      render: (val) => new Date(val).toLocaleString("en-IN"),
    },
    impanelledBy: { label: "Impanelled By" },
    salesAssistant: { label: "Sales Person" },
    projectCode: { label: "Project Code" },
    salesType: { label: "Sales Type" },
    projectName: { label: "Project Name" },
    projectDetail: { label: "Project Detail" },
    clientName: { label: "Concern Person Name" },
    concernPersonDesignation: { label: "Concern Person Designation" },
    companyName: { label: "Company / Individual Name" },
    phone: { label: "Contact Number" },
    altPhone: { label: "Alternate Number" },
    fullAddress: { label: "Full Address" },

    locationLink: {
      label: "Location Link",
      render: (val) =>
        val ? (
          <a
            href={val}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Location
          </a>
        ) : (
          "-"
        ),
    },
  };

  return (
    <div className="">
      <PageHeader title="Sales Client Briefing" />

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
            // handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default ClientBriefing;
