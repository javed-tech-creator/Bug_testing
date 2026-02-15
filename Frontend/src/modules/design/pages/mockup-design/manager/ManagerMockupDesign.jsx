import { useGetAllUploadedMockupQuery, useGetAllVersionForApprovalDesignQuery, useGetAllViewMockUpQuery, useMarkAsMeasurementStartedMutation } from "@/api/design/common_workflow/view-design-option.api";
import { viewAction } from "@/modules/design/components/action/ViewActionButton";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import DesignsTable from "@/modules/design/components/designs/DesignsTable";
import { getMockupDesign } from "@/modules/design/config/MockupDesign";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const designDummyData = [
  {
    id: "1",
    designId: "DSN-001",
    productName: "LED Board",
    totalProducts: "LED",
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
    totalProducts: "LED",
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
    totalProducts: "LED",
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
    totalProducts: "LED",
    priority: "High",
    createdAt: "2025-08-28",
    startedDate: "2025-08-28",
    approveDate: "2025-08-28",
    deadline: "2025-09-01",
    status: "submitted_to_client",
  },
];

const ManagerMockupDesign = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedExecutive, setSelectedExecutive] = useState("");

  const navigate = useNavigate();
  const executivesList = [
    { _id: "u1", name: "Rahul" },
    { _id: "u2", name: "Amit" },
    { _id: "u3", name: "Neha" },
  ];

  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  const { type } = useParams();
  console.log("type ", type);

  const isUploadType = type == "upload";
  const isViewType = type == "view"
  const isVersionType = type == "version"


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

  const {
    data: versionApprovalData,
    isLoading: versionApprovalLoading,
    isFetching: versionApprovalFetching,
    error: versionApprovalError
  } = useGetAllVersionForApprovalDesignQuery({
    page: currentPage,
    limit: itemsPerPage
  },
    {
      skip: !isVersionType
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
    },
    "version": {
      data: versionApprovalData,
      isLoading: versionApprovalLoading,
      isFetching: versionApprovalFetching,
      error: versionApprovalError
    }
  }


  const [markMeasurementStarted, { isUpading }] = useMarkAsMeasurementStartedMutation();

  const { data, isLoading, isFetching, error } = stateByType[type] ?? {}

  useEffect(() => {
    console.log('data:>', data)
  }, [data])

  // ========================= end api section =====================


  const handleView = (row) => {
    // navigate(`/design/manager/designs/mockup/view/${row.id}`);

    if (type === "version") {
      navigate(`/design/manager/designs/mockup/version/${row.id}`, {
        state: {
          title: "Shared Design Mockup",
        },
      });
    }
  };

  // const handleView = (row) => {
  //   if (type === "started") {
  //     navigate(
  //       `/design/executive/designs/mockup-started-view/${type}/${row.id}`,
  //       {
  //         state: {
  //           title: "Submit Mockup Design",
  //         },
  //       }
  //     );
  //   } else if (type === "modification") {
  //     navigate(
  //       `/design/executive/designs/mockup-modification-view/${type}/${row.id}`,
  //       {
  //         state: {
  //           title: "Submit Modified Mockup ",
  //         },
  //       }
  //     );
  //   }
  // };

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

  const handleMeasurementForQuotation = async (selectedRow) => {
    console.log('selectedROw:>', selectedRow);

    try {
      const res = await markMeasurementStarted({ id: selectedRow?.id }).unwrap();
      toast.success(res?.data?.message ?? res?.message ?? "Marked Successfully.")
    } catch (err) {
      console.log('err:>', err);
      toast.error(err?.data?.message ?? err?.error?.message ?? err?.message ?? "Failed.")
    }
  };

  const designMockup = getMockupDesign({
    onView: handleView,
    submitMockupDesign: handleMockupDesign,
    submitModifiedMockup: handleSubmitModifiedMockup,
    submitMeasurementForQuotation: handleMeasurementForQuotation,
  });

  const mockup = designMockup[type];

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
    { key: "projectName", label: "Projects" },
    { key: "totalProducts", label: "Products" },
    { key: "status", label: "Status" },
    { key: "startedDate", label: "Started Date" },

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

  return (
    <div className="px-5">
      <DesignsHeader
        title="Design Mockup"
        // showDateFilter={true}
        showStatusFilter={false}
        onPriorityChange={(value) => setPriority(value)}
        onStatusChange={(value) => setStatus(value)}
        showExecutiveFilter={true}
        executives={executivesList}
        onExecutiveChange={(userId) => {
          setSelectedExecutive(userId);
          // yahin se API/filter call
        }}
      />

      <DesignsTable
        columnArray={mockup.columnArray}
        tableData={designDummyData}
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



export default ManagerMockupDesign;
