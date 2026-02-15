import { useGetAssetsQuery } from '@/api/technology/assetManagement.api';
import PageHeader from '@/components/PageHeader';
import React, { useState } from 'react'
import TechnologyTable from '../../components/TechnologyTable';

const EmployeeAssetList = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
  
  
      const { data:assets, isLoading:getAssetLoading, isFetching:getAssetFetching} = useGetAssetsQuery({
    page: currentPage,
    limit: itemsPerPage,
  } );
  console.log("employee asset data is ",assets);

  const columnConfig = {
  
    tag: { label: "Asset Tag" },
    type: { label: "Type" },
    brand: { label: "Brand" },
    model: { label: "Model" },
    location: { label: "Location" },
    status: { label: "Status" },
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
    warranty_end: {
      label: "Warranty End",
     render: (row) => {
      if (!row.warranty_end) return "-";
  
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return new Date(row.warranty_end)
        .toLocaleDateString("en-GB", options)
        .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2"); 
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
    const columnArray = Object.entries(columnConfig).map(([key, value]) => ({
    key, // <-- ye zaroori hai
    ...value,
  }));
  
  return (
    <>
        <PageHeader title="All Assigned Assets" />
        <div className="mt-4">
          <TechnologyTable
            columnArray={columnArray}
            tableData={assets?.data}
            total={assets?.total}
            isLoading={getAssetLoading || getAssetFetching}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
    </>
  )
}

export default EmployeeAssetList