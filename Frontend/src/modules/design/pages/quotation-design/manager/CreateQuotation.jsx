import React, { useEffect, useMemo, useState } from "react";
import DesignsHeader from "../../../components/designs/DesignHeader";
import DesignsTable from "../../../components/designs/DesignsTable";
import { useNavigate, useParams } from "react-router-dom";
import { Eye } from "lucide-react";
import { getQuotationMeasurement } from "../../../config/QuotationMeasurement";
import { useGetMeasurementApprovalListQuery, useGetMeasurementQuotationListQuery, useGetMeasurementQuotationViewListQuery } from "@/api/design/common_workflow/view-design-option.api";

const tableData = [
  {
    id: 1,
    designId: "T-421",
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

const CreateQuotation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const { type } = useParams();


  const isCreateType = type == 'create';
  const isViewType = type == 'view';
  const isApprovalType = type == 'approval';

  const handleView = (row) => {
    if (type === "approval") {
      navigate(`/design/manager/designs/measurement-quotation-view/${row.id}`);
    } else if (type === "view") {
      navigate(`/design/executive/designs/quotation-view/${"View"}/${row.id}`);
    }
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


  // ============================== api related section start ====================
  const {
    data: createdListData,
    isLoading: createListLoading,
    isFetching: createListFetching,
    error: createListError
  } = useGetMeasurementQuotationListQuery({
    page: currentPage,
    limit: itemsPerPage
  }, {
    skip: !isCreateType
  })

  const {
    data: viewListData,
    isLoading: viewListLoading,
    isFetching: viewListFetching,
    error: viewListError
  } = useGetMeasurementQuotationViewListQuery({
    page: currentPage,
    limit: itemsPerPage
  }, {
    skip: !isViewType
  })


  const {
    data: approvalListData,
    isLoading: approvalListLoading,
    isFetching: approvalListFetching,
    error: approvalListError
  } = useGetMeasurementApprovalListQuery({
    page: currentPage,
    limit: itemsPerPage
  }, {
    skip: !isApprovalType
  })

  const apiStateByType = {
    "create": {
      data: createdListData,
      isLoading: createListLoading,
      isFetching: createListFetching,
      error: createListError
    },
    "view": {
      data: viewListData,
      isLoading: viewListLoading,
      isFetching: viewListFetching,
      error: viewListError
    },
    "approval": {
      data: approvalListData,
      isLoading: approvalListLoading,
      isFetching: approvalListFetching,
      error: approvalListError
    }
  }


  const { data, isLoading, isFetching, error } = apiStateByType[type];

  useEffect(() => {
    console.log({ data })
  }, [data])

  // ============================== api related section end ====================

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

export default CreateQuotation;



