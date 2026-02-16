import React, { useEffect, useState } from "react";
import DesignsHeader from "../../components/designs/DesignHeader";
import DesignsTable from "../../components/designs/DesignsTable";
import { useNavigate } from "react-router-dom";
import { viewAction } from "../../components/action/ViewActionButton";
import { Send } from "lucide-react";
import { useGetManagerAllDesignQuotationQuery, useSendManagerDesignQuotationMutation } from "@/api/design/common_workflow/design-review/design-review.api";
import { toast } from "react-toastify";

const tableData = [
  {
    id: 1,
    designId: "T-421",
    clientName: "Rahul Singh",
    submittedToQuotation: true,
    product: 13,
    productPending: 10,
    productCompleted: 3,
    project: "Retails Store Signage",
    date: "11 Nov 25, 10:30AM",
    priority: "High",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 2,
    designId: "T-423",
    clientName: "Yash Pal",
    submittedToQuotation: false,
    priority: "Low",
    product: 10,
    productPending: 0,
    productCompleted: 10,
    project: "Mall Facade Design's",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 3,
    designId: "T-424",
    clientName: "Dhurander Singh",
    submittedToQuotation: true,
    product: 5,
    productPending: 4,
    productCompleted: 1,
    priority: "Medium",
    project: "Office Branding Survey",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 4,
    designId: "T-425",
    clientName: "Rohit Gupta",
    submittedToQuotation: true,
    product: 4,
    productPending: 1,
    productCompleted: 3,
    priority: "High",
    project: "Retails Store Signage",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 5,
    designId: "T-427",
    clientName: "Modi Singh",
    submittedToQuotation: true,
    product: 8,
    productPending: 3,
    productCompleted: 5,
    priority: "Low",
    project: "Mall Facade Design's",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 6,
    designId: "T-428",
    submittedToQuotation: true,
    clientName: "Chandrabhan Yadav",
    product: 5,
    productPending: 2,
    productCompleted: 3,
    priority: "Medium",
    project: "Office Branding Survey",
    date: "11 Nov 25, 10:30AM",
    deadline: "11 Nov 25, 11:30AM",
  },
];

const DesignInQuotation = () => {
  const [priority, setPriority] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();

  const [sendQuaotation, { isUpating }] = useSendManagerDesignQuotationMutation();

  const onView = (row) => {
    navigate(`/design/manager/designs/review-details/${row.id}`);
  };

  const handleSubmitToQuotation = async (row) => {
    console.log('row:>', row);
    try {
      const payLoad = {
        assigned_designed_id: "",
        recce_id: "",
        client_id: "",
        product_id: "",
        project_id: ""
      }
      const res = await sendQuaotation({ data: payLoad }).unwrap();
      toast.success(res?.data?.message ?? res?.message ?? "Saved successfully.")
    } catch (err) {
      console.log('err:>', err);
      toast.error(err?.data?.message ?? data?.error?.message ?? "Failed to send!");
    }

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
        <div className="flex gap-3 justify-center items-center">
          {viewAction(row, onView)}

          {!row?.submittedToQuotation ? (
            <button
              onClick={() => handleSubmitToQuotation(row)}
              title="Submit to Quotation"
              className="border cursor-pointer border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded-lg"
            >
              <Send size={18} />
            </button>
          ) : (
            <span className="text-green-600  text-sm font-semibold p-1">
              ---
            </span>
          )}
        </div>
      ),
    },
    // { key: "designId", label: "Design ID" },
    { key: "clientName", label: "Client Name" },
    { key: "project", label: "Projects" },
    {
      key: "product",
      label: "Total Product",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "productPending",
      label: "Pending",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "productCompleted",
      label: "Completed",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600}`}
        >
          {value}
        </span>
      ),
    },
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
    { key: "deadline", label: "Completed On" },
  ];

  const {
    data,
    isLoading,
    isFetching,
    error
  } = useGetManagerAllDesignQuotationQuery(
    {
      page: currentPage,
      limit: itemsPerPage
    }
  )

  return (
    <div className="px-5">
      <DesignsHeader
        title="Report In Quotation Department"
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

export default DesignInQuotation;
