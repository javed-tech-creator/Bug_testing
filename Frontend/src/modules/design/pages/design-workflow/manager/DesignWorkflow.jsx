import { viewAction } from "@/modules/design/components/action/ViewActionButton";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import DesignsTable from "@/modules/design/components/designs/DesignsTable";
import { getDesignWorkFlow } from "@/modules/design/config/DesignWorkFlow";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetAllDesignOptionListQuery, useGetAllDesignWorkFlowQuery } from "@/api/design/common_workflow/work-flow.api";
import { useGetAllViewDesignsQuery, useMarkAsMockUpStartedMutation } from "@/api/design/common_workflow/view-design-option.api";
import { toast } from "react-toastify";

const DesignWorkflow = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedExecutive, setSelectedExecutive] = useState("");

  const navigate = useNavigate();


  const executivesList = [
    { _id: "u1", name: "Rahul" },
    { _id: "u2", name: "Amit" },
    { _id: "u3", name: "Neha" },
  ];

  const { type } = useParams();



  const isUploadType = type == "upload";
  const isViewType = type == "view";
  const isOptionVersionType = ["options","versions"].includes(type);

  const apiTypeParam = type == "options" ? "option" : type == "versions" ? "version" : "";


  const [markAsMockUpStarted, { isUpdating }] = useMarkAsMockUpStartedMutation();

  const handleView = (row) => {
    if (type === "upload") {
      navigate(`/design/executive/designs/workflow/view/${row.id}`, {
        state: {
          title: "Design Details",
        },
      });
    } else if (type === "view") {
      navigate(
        `/design/executive/designs/workflow/design-options-view/${row.id}`,
        {
          state: {
            title: "Design Option Details",
          },
        }
      );
    } else if (type === "options") {
      navigate(`/design/manager/designs/workflow/option/${row.id}`, {
        state: {
          title: "Design Option For Approval",
        },
      });
    } else if (type === "versions") {
      navigate(`/design/manager/designs/workflow/version/${row.id}`, {
        state: {
          title: "Version Details",
        },
      });
    }
  };

  const handleSubmitDesignOption = (row) => {
    console.log("row is", row);

    navigate(`/design/executive/designs/workflow/design-option-form/${row.id}`);
  };

  const handleModifiedDesignOption = (row) => {
    navigate(
      `/design/executive/designs/workflow/design-modification-form/${row.id}`,
      {
        state: {
          title: "Design Modification",
        },
      }
    );
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
      totalProducts: "Showroom",
      projectName: "Showroom Branding",
      priority: "High",
      createdAt: "2025-09-01",
      approveDate: "2025-08-28",
      receivedDate: "2025-08-28",
      deadline: "2025-09-05",
      status: "rejected",
      designOption: 2,
    },
    {
      id: "2",
      designId: "DSN-002",
      client: "Mahindra",
      productName: "Neon Sign",
      projectName: "Dealer Outlet",
      totalProducts: "Dealer",
      priority: "Medium",
      receivedDate: "2025-08-28",
      createdAt: "2025-09-02",
      deadline: "2025-09-06",
      approveDate: "2025-08-28",
      status: "modification_required",
      designOption: 1,
    },
    {
      id: "3",
      designId: "DSN-003",
      client: "Hyundai",
      productName: "Glow Sign",
      projectName: "Service Center",
      totalProducts: "Service",
      priority: "Low",
      createdAt: "2025-09-03",
      approveDate: "2025-08-28",
      receivedDate: "2025-08-28",
      deadline: "2025-09-10",
      status: "approved",
      designOption: 4,
    },
    {
      id: "4",
      designId: "DSN-004",
      client: "Maruti Suzuki",
      productName: "ACP Signage",
      projectName: "Workshop Board",
      totalProducts: "Workshop",
      priority: "High",
      createdAt: "2025-08-28",
      receivedDate: "2025-08-28",
      approveDate: "2025-08-28",
      deadline: "2025-09-01",
      status: "pending",
      designOption: 6,
    },
    {
      id: "5",
      designId: "DSN-005",
      client: "Suzuki Anok",
      productName: "ACP Signage",
      projectName: "Workshop Board",
      totalProducts: "Board",
      priority: "High",
      createdAt: "2025-08-28",
      receivedDate: "2025-08-28",
      approveDate: "2025-08-28",
      deadline: "2025-09-01",
      status: "approved",
      designOption: 1,
    },
  ];


  //===================================== start api section ==========================
  const {
    data: uploadData,
    isLoading: uploadLoading,
    isFetching: uploadFetching,
    error: uploadError
  } = useGetAllDesignWorkFlowQuery({
    page: currentPage,
    limit: itemsPerPage
  },
    {
      skip: !isUploadType
    })


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

  const {
    data: approvalOptionVersionData,
    isLoading: approvalOptionVersionLoading,
    isFetching: approvalOptionVersionFetching,
    error: approvalOptionVersionError
  } = useGetAllDesignOptionListQuery({
    page: currentPage,
    limit: itemsPerPage,
    type: apiTypeParam
  }, {
    skip: !isOptionVersionType
  }
  )

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
    },
    "option": {
      data: approvalOptionVersionData,
      isLoading: approvalOptionVersionLoading,
      isFetching: approvalOptionVersionFetching,
      error: approvalOptionVersionError
    }
  }


  const activeApiState = apiStateByType[type] || {
    data: null,
    isLoading: false,
    isFetching: false,
    error: null
  };

  const { data, isLoading, isFetching, error } = activeApiState;

  // ========================================= end api section ========================

  useEffect(() => {
    console.log({ data })
  }, [data])

  return (
    <div className="px-5">
      <DesignsHeader
        title={workFlow.title || ""}
        showExecutiveFilter={true}
        executives={executivesList}
        onExecutiveChange={(userId) => {
          setSelectedExecutive(userId);
          // yahin se API/filter call
        }}
      />

      <DesignsTable
        columnArray={workFlow.columnArray}
        tableData={designDummyData}
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


export default DesignWorkflow;
