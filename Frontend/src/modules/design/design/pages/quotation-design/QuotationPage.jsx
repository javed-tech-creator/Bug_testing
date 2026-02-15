import React, { useMemo, useState } from "react";
import DesignsHeader from "../../components/designs/DesignHeader";
import DesignsTable from "../../components/designs/DesignsTable";
import { useNavigate, useParams } from "react-router-dom";
import { Eye } from "lucide-react";
import { getQuotationMeasurement } from "../../config/QuotationMeasurement";
import { useGetMeasurementQuotationListQuery, useGetMeasurementQuotationViewListQuery } from "@/api/design/common_workflow/view-design-option.api";

const tableData = [
  {
    id: 1,
    designId: "T-4211",
    product: "Flex Sign Board",
    project: "Retails Store Signage",
    date: "11 Nov 25, 10:30AM",
    status: "approved",
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
    status: "modification_required",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 3,
    designId: "T-424",
    product: "Acrylic Sign Board",
    priority: "Medium",
    project: "Office Branding Survey",
    date: "11 Nov 25, 10:30AM",
    status: "approved",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 4,
    designId: "T-425",
    product: "Vinyl Cut Signage",
    priority: "High",
    project: "Retails Store Signage",
    date: "11 Nov 25, 10:30AM",
    status: "rejected",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 5,
    designId: "T-427",
    product: "Glow Sign Board",
    priority: "Low",
    project: "Mall Facade Design's",
    date: "11 Nov 25, 10:30AM",
    status: "submitted_to_manager",
    deadline: "11 Nov 25, 11:30AM",
  },
  {
    id: 6,
    designId: "T-428",
    product: "LED Channel Letter Signage",
    priority: "Medium",
    project: "Office Branding Survey",
    date: "11 Nov 25, 10:30AM",
    status: "approved",
    deadline: "11 Nov 25, 11:30AM",
  },
];

const QuotationPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const { type } = useParams();

  const isCreateType = type == "create";
  const isViewType  = type == "view";

  const onView = (row) => {
    navigate(`/design/executive/designs/quotation-view/${row.status}/:id`);
  };

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      if (status && item.status !== status) return false;
      if (priority && item.priority !== priority) return false;
      return true;
    });
  }, [status, priority, tableData]);

  const priorityConfig = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-600",
  };

  const statusConfig = {
    Started: "bg-orange-100 text-orange-600",
    "Modification Required": "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
    "Submitted To Manager": "bg-blue-100 text-blue-600",
  };

  const tableColumns = [
    { key: "designId", label: "Design ID" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center">
          <button
            onClick={() => onView(row)}
            className="border cursor-pointer border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg"
          >
            <Eye size={18} />
          </button>
        </div>
      ),
    },
    { key: "product", label: "Product" },
    { key: "project", label: "Projects" },
    { key: "date", label: "Date" },
    {
      key: "priority",
      label: "Priority",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[value] || "bg-gray-100 text-gray-600"
            }`}
        >
          {value}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[value] || "bg-gray-100 text-gray-600"
            }`}
        >
          {value}
        </span>
      ),
    },
    { key: "deadline", label: "Deadline" },
  ];

  const handleView = (row) => {
    if (type === "view") {
      navigate(`/design/executive/designs/quotation-view/${"View"}/${row.id}`);
    }
  };

  const handleSubmitQuotation = (row) => {
    navigate(`/design/executive/designs/quotation-view/${"Started"}/${row.id}`);
  };

  const handleQuotationReport = (row) => {
    navigate(`/design/executive/designs/review-design-submit/${row.designId}`);
  };
  const handleModifiedQuotation = (row) => {
    navigate(`/design/executive/designs/quotation-view/${"Started"}/${row.id}`);
  };

  const designTypeConfig = getQuotationMeasurement({
    onView: handleView,
    submitQuotation: handleSubmitQuotation,
    submitMeasurementForQuotationReport: handleQuotationReport,
    submitModifiedQuotation: handleModifiedQuotation,
  });
  const config = designTypeConfig[type];

  if (!config) {
    return (
      <p className="h-full w-full flex justify-center items-center text-red-500">
        Route Not Exist
      </p>
    );
  }


  // ============================ api section started =======================

  // get the all assigned designs api & state
  
  // get create measurement list data
  const {
    data: createData,
    isLoading: createLoading,
    isFetching: createFetching,
    error: createError
  } = useGetMeasurementQuotationListQuery({
    page: currentPage,
    limit: itemsPerPage,

  }, {
    skip: !isCreateType
  })

// get view measurement list data
 const {
    data: viewData,
    isLoading: viewLoading,
    isFetching: viewFetching,
    error: viewError
  } = useGetMeasurementQuotationViewListQuery({
    page: currentPage,
    limit: itemsPerPage,

  }, {
    skip: !isViewType
  })



  const apiStateByType = {
    "create": {
      data: createData,
      isLoading: createLoading,
      isFetching: createFetching,
      error: createError
    },
    "view": {
      data: viewData,
      isLoading: viewLoading,
      isFetching: viewFetching,
      error: viewError
    }
  }

  const activeApiState = apiStateByType[type] || {
    data: null,
    isLoading: false,
    isFetching: false,
    error: null
  };

  const { data, isLoading, isFetching, error } = activeApiState;

  console.log({ data })

  // ============================ api section end =======================


  return (
    <div className="px-5">
      <DesignsHeader
        title={config.title}
        showDateFilter={true}
        showPriorityFilter={false}
        showSubmitNewDesign={false}
        showStatusFilter={true}
        onStatusChange={(value) => setStatus(value)}
        onPriorityChange={(value) => setPriority(value)}
      />

      <DesignsTable
        columnArray={config.columnArray}
        tableData={filteredData}
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

export default QuotationPage;
