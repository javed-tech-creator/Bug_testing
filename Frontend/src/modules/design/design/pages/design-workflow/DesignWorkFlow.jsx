import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignsHeader from "../../components/designs/DesignHeader";
import DesignsTable from "../../components/designs/DesignsTable";
import { getDesignWorkFlow } from "../../config/DesignWorkFlow";
import { useGetAllDesignWorkFlowQuery } from "@/api/design/common_workflow/work-flow.api";
import { useGetAllViewDesignsQuery, useMarkAsMockUpStartedMutation } from "@/api/design/common_workflow/view-design-option.api";
import { toast } from "react-toastify";

const DesignWorkFlow = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const { type } = useParams();
  console.log("type1 ", type);
  const navigate = useNavigate();

  const isUploadType = type == "upload";
  const isViewType = type == "view";


  const [markAsMockUpStarted, { isUpdating }] = useMarkAsMockUpStartedMutation();

  const handleView = (row) => {
    if (type === "upload") {
      navigate(`/design/executive/designs/workflow/view/${row.id}`, {
        state: {
          title: "Design Details",
        },
      });
    } else if (type === "view") {
      navigate(`/design/executive/designs/workflow/design-options-view/${row.id}`, {
        state: {
          title: "Design Option Details",
        },
      });
    }
  };

  const handleSubmitDesignOption = (row) => {
    console.log("row is", row);

    navigate(`/design/executive/designs/workflow/design-option-form/${row.id}`);
  };

  const handleModifiedDesignOption = (row) => {
    navigate(`/design/executive/designs/workflow/design-modification-form/${row.id}`, {
      state: {
        title: "Design Modification",
      },
    });
  };

  const handleMockupStart = async (selectedRow) => {

    console.log('inside the handle mockup started');
    console.log({ selectedRow })

    try {
      const res = await markAsMockUpStarted({ id: selectedRow?.id }).unwrap();
      toast.success(res?.message ?? res?.data?.message ?? "Mockup started successfully.")
    } catch (err) {
      console.log("error:>", err);
      toast.error(err?.error?.message ?? err?.data?.message ?? err?.message ?? "Failed to start!")
    }

    // markAsMockUpStarted

  };

  const designWorkFlow = getDesignWorkFlow({
    onView: handleView,
    submitNewDesign: handleSubmitDesignOption,
    submitModifiedDesign: handleModifiedDesignOption,
    submitMockupStart: handleMockupStart,
  });

  const workFlow = designWorkFlow[type];
  console.log("workflow are", workFlow);

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
      receivedDate: "2025-08-28",
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
      receivedDate: "2025-08-28",
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
      receivedDate: "2025-08-28",
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
      receivedDate: "2025-08-28",
      approveDate: "2025-08-28",
      deadline: "2025-09-01",
      status: "submitted_to_client",
    },
    {
      id: "5",
      designId: "DSN-005",
      client: "Suzuki Anok",
      productName: "ACP Signage",
      projectName: "Workshop Board",
      totalProducts: 2,
      priority: "High",
      createdAt: "2025-08-28",
      receivedDate: "2025-08-28",
      approveDate: "2025-08-28",
      deadline: "2025-09-01",
      status: "submitted_to_manager",
    },
  ];

  // FILTER STATES (PARENT)

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


  // =============================== start api section ==========================
  const {
    data: uploadData,
    isLoading: uploadLoading,
    isFetching: uploadFetching,
    error: uploadError
  } = useGetAllDesignWorkFlowQuery({
    page: currentPage,
    limit: itemsPerPage
  }, {
    skip: !isUploadType
  }
  )
  const {
    data: viewData,
    isLoading: viewLoading,
    isFetching: viewFetching,
    error: viewError
  } = useGetAllViewDesignsQuery({
    page: currentPage,
    limit: itemsPerPage
  }, {
    skip: !isViewType
  }
  )
  //====================================  end api section ===================================

  const apiStateByType = {
    "upload": {
      data: uploadData,
      isLoading: uploadLoading,
      isFetching: uploadFetching,
      error: uploadError
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

  useEffect(() => {
    console.log({ data })
  }, [data])

  return (
    <div className="px-5">
      <DesignsHeader
        title={workFlow.title}
        showDateFilter={true}
        showPriorityFilter={type === "started"}
        showStatusFilter={type !== "started"}
        onPriorityChange={(value) => setPriority(value)}
        onStatusChange={(value) => setStatus(value)}
      />

      <DesignsTable
        columnArray={workFlow.columnArray}
        tableData={filteredData}
        total={designDummyData.length}
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

export default DesignWorkFlow;
