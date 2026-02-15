import PageHeader from "@/components/PageHeader";
import React, { useState } from "react";
import TechnologyTable from "../../components/TechnologyTable";
import { useGetLicensesQuery } from "@/api/technology/licenseSoftware.api";

const AllSoftwareEmpoloyeeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  //  call query with pagination
  const { data: licenseSoftware, isLoading: licenseLoading } =
    useGetLicensesQuery({
      page: currentPage,
      limit: itemsPerPage,
    });

  const columnConfig = {
    licenseId: { label: "License ID / Key" },
    softwareName: { label: "Software Name" },
    versionType: { label: "Version / Type" },
    assignedDate: {
      label: "Assigned Date",
      render: (row) => {
        if (!row.assignedTo?.date) return <span>-</span>;

        const options = { day: "2-digit", month: "short", year: "numeric" };
        const assigned = new Date(row.assignedTo.date).toLocaleDateString(
          "en-GB",
          options
        );

        return <span>{assigned}</span>;
      },
    },

    validityEnd: {
      label: "Validity End",
      render: (row) => {
        const options = { day: "2-digit", month: "short", year: "numeric" };

        const endDate = new Date(row.validityEnd);
        const end = endDate.toLocaleDateString("en-GB", options);

        const today = new Date();
        const diffTime = endDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          return <span>{end}</span>;
        }

        return <span>{end}</span>;
      },
    },
      expireIn: {
      label: "Expire In",

     render: (row) => {
  if (!row.expireIn) return null; // safeguard

  // Check if it's expired or has days left
  const isExpired = row.expireIn.toLowerCase() === "expired";

  return (
    <span
      style={{
        color: isExpired ? "red" : "green",
        fontWeight: 600,
      }}
    >
      {row.expireIn}
    </span>
  );
},

    },
  };

  // Build columnArray correctly
  const columnArray = Object.entries(columnConfig).map(([key, value]) => ({
    key, // <-- ye zaroori hai
    ...value,
  }));

  return (
    <div className="">
      <PageHeader title="All Assigned Software & License" />

      <div className="mt-4">
        <TechnologyTable
          columnArray={columnArray}
          tableData={licenseSoftware?.data}
          total={licenseSoftware?.total}
          isLoading={licenseLoading}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AllSoftwareEmpoloyeeList;
