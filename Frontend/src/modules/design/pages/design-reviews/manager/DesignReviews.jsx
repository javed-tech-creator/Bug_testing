import { useGetManagerAllDesignReviewListQuery } from "@/api/design/common_workflow/design-review/design-review.api";
import { viewAction } from "@/modules/design/components/action/ViewActionButton";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import DesignsTable from "@/modules/design/components/designs/DesignsTable";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const tableData = [
  {
    id: 1,
    designId: "T-421",
    product: "Flex Sign Board",
    project: "Retails Store Signage",
    date: "11 Nov 25, 10:30AM",
    priority: "High",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 2,
    designId: "T-423",
    priority: "Low",
    product: "LED Channel Letter Signage",
    project: "Mall Facade Design's",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 3,
    designId: "T-424",
    product: "Acrylic Sign Board",
    priority: "Medium",
    project: "Office Branding Survey",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 4,
    designId: "T-425",
    product: "Vinyl Cut Signage",
    priority: "High",
    project: "Retails Store Signage",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 5,
    designId: "T-427",
    product: "Glow Sign Board",
    priority: "Low",
    project: "Mall Facade Design's",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 6,
    designId: "T-428",
    product: "LED Channel Letter Signage",
    priority: "Medium",
    project: "Office Branding Survey",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
];
const DesignReviews = () => {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();


  const onView = (row) => {
    navigate(`/design/manager/designs/review-details/${row.id}`);
  };

  const columnArray = [
    {
      key: "index",
      label: "S.No",
      render: (_, __, index) => index + 1,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex gap-3 justify-center">
          {viewAction(row, onView)}
        </div>
      ),
    },
    { key: "designId", label: "Design ID" },
    { key: "product", label: "Product" },
    { key: "project", label: "Projects" },
    { key: "date", label: "Date" },
    {
      key: "priority",
      label: "Priority",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${value === "High"
              ? "bg-red-100 text-red-600"
              : value === "Medium"
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
            }`}
        >
          {value}
        </span>
      ),
    },
    { key: "deadline", label: "Deadline" },
  ];

  const {
    data,
    isLoading,
    isFetching,
    error
  } = useGetManagerAllDesignReviewListQuery(
    {
      page: currentPage,
      limit: itemsPerPage
    }
  )

  useEffect(() => {
    console.log('data:>', data)
  }, [data])

  return (
    <div className="px-5">
      <DesignsHeader
        title="Design Reports"
        showDateFilter={true}
        showPriorityFilter={true}
        showSubmitNewDesign={false}
        onPriorityChange={(value) => setPriority(value)}
      />

      <DesignsTable
        columnArray={columnArray}
        tableData={tableData}
        total={tableData.length}
        // isLoading={isLoading || isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        // showActiveFilter={true}      //  enable here only
        // isActive={isActive}
        // setIsActive={setIsActive}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};



export default DesignReviews;
