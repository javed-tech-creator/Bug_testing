import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignsHeader from "../../components/designs/DesignHeader";
import DesignsTable from "../../components/designs/DesignsTable";
import { getMockupDesign } from "../../config/MockupDesign";
import { useGetAllUploadedMockupQuery, useGetAllViewDesignsQuery, useGetAllViewMockUpQuery } from "@/api/design/common_workflow/view-design-option.api";

const MockupDesign = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const { type } = useParams();
  console.log("type ", type);

  const isUploadType = type == "upload";
  const isViewType = type == "view"

  const navigate = useNavigate();
  const handleView = (row) => {
    if (type === "started") {
      navigate(`/design/executive/designs/mockup-started-view/${type}/${row.id}`, {
        state: {
          title: "Submit Mockup Design",
        },
      });
    } else if (type === "modification") {
      navigate(`/design/executive/designs/mockup-modification-view/${type}/${row.id}`, {
        state: {
          title: "Submit Modified Mockup ",
        },
      });
    }
  };

  const handleMockupDesign = (row) => {
    navigate(`/design/executive/designs/mockup-option-form/${row.id}`, {
      state: {
        title: "Submit Mockup Design",
      },
    });
  };

  const handleSubmitModifiedMockup = (row) => {
    navigate(`/design/executive/designs/mockup-modification-view/${row.id}`, {
      state: {
        title: "Submit Modified Mockup",
      },
    });
  };

  const handleMeasurementForQuotation = (selectedRow) => { 
    console.log('selectedRow:>',selectedRow)
  };

  const designMockup = getMockupDesign({
    onView: handleView,
    submitMockupDesign: handleMockupDesign,
    submitModifiedMockup: handleSubmitModifiedMockup,
    submitMeasurementForQuotation: handleMeasurementForQuotation,
  });

  const mockup = designMockup[type];
  console.log("mockup are", mockup);

  const designDummyData = [
    {
      id: "1",
      designId: "DSN-001",
      productName: "LED Board",
      totalProducts: 5,
      projectName: "Showroom Branding",
      priority: "High",
      createdAt: "2025-09-01",
      approveDate: "2025-08-28",
      startedDate: "2025-08-28",
      deadline: "2025-09-05",
      status: "rejected",
    },
    {
      id: "2",
      designId: "DSN-002",
      client: "Mahindra",
      productName: "Neon Sign",
      projectName: "Dealer Outlet",
      totalProducts: 2,
      priority: "Medium",
      startedDate: "2025-08-28",
      createdAt: "2025-09-02",
      deadline: "2025-09-06",
      approveDate: "2025-08-28",
      status: "modification_required",
    },
    {
      id: "3",
      designId: "DSN-003",
      client: "Hyundai",
      productName: "Glow Sign",
      projectName: "Service Center",
      totalProducts: 8,
      priority: "Low",
      createdAt: "2025-09-03",
      approveDate: "2025-08-28",
      startedDate: "2025-08-28",
      deadline: "2025-09-10",
      status: "approved",
    },
    {
      id: "4",
      designId: "DSN-004",
      client: "Maruti Suzuki",
      productName: "ACP Signage",
      projectName: "Workshop Board",
      totalProducts: 5,
      priority: "High",
      createdAt: "2025-08-28",
      startedDate: "2025-08-28",
      approveDate: "2025-08-28",
      deadline: "2025-09-01",
      status: "submitted_to_client",
    },
  ];

  // FILTER STATES (PARENT)
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const filteredData = useMemo(() => {
    return designDummyData.filter((item) => {
      // 1️ Priority filter (sirf "started" type ke liye)
      const matchPriority =
        type === "started"
          ? priority === "" || item.priority.toLowerCase() === priority
          : true;

      // 2️ Status filter (baaki 3 types ke liye)
      const matchStatus =
        type !== "started" ? status === "" || item.status === status : true;

      return matchPriority && matchStatus;
    });
  }, [priority, status, type, designDummyData]);


  // ======================== start api section =================

  const {
    data: uploadMockupData,
    isLoading: uploadMockupLoading,
    isFetching: uploadMockUpFetching,
    error: uploadMockupError
  } = useGetAllUploadedMockupQuery({
    page: currentPage,
    limit: itemsPerPage
  },
    {
      skip: !isUploadType
    })

  const {
    data: viewDesignData,
    isLoading: viewDesignLoading,
    isFetching: viewDesignFetching,
    error: viewDesignError
  } = useGetAllViewMockUpQuery({
    page: currentPage,
    limit: itemsPerPage
  },
    {
      skip: !isViewType
    })


  const stateByType = {
    "upload": {
      data: uploadMockupData,
      isLoading: uploadMockupLoading,
      isFetching: uploadMockUpFetching,
      error: uploadMockupError
    },
    "view": {
      data: viewDesignData,
      isLoading: viewDesignLoading,
      isFetching: viewDesignFetching,
      error: viewDesignError
    }
  }

  const { data, isLoading, isFetching, error } = stateByType[type] ?? {}

  // ========================= end api section =====================


  return (
    <div className="px-5">
      <DesignsHeader
        title={mockup.title}
        showDateFilter={true}
        showPriorityFilter={type === "started"}
        showStatusFilter={type !== "started"}
        onPriorityChange={(value) => setPriority(value)}
        onStatusChange={(value) => setStatus(value)}
      />

      <DesignsTable
        columnArray={mockup.columnArray}
        tableData={filteredData}
        total={designDummyData.length}
        // isLoading={isLoading || isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        // showActiveFilter={true}      // enable here only
        // isActive={isActive}
        // setIsActive={setIsActive}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default MockupDesign;
