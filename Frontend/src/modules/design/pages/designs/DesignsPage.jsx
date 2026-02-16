import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignsTable from "../../components/designs/DesignsTable";
import DesignsHeader from "../../components/designs/DesignHeader";
import { getDesignTypeConfig } from "../../config/DesignTypes";
import RequestModal from "../../components/designs/RequestModal";
import { useGetAllTodayDesignsQuery } from "@/api/design/manager/today-designs/todayDesigns.api";
import { useGetAllNextDayPlanningQuery } from "@/api/design/executive/next-day-planning/next-day-planning.api";
import { useGetAllWaitingLostExceDesignsQuery } from "@/api/design/executive/waiting-lost/waiting-lost.api";
import { useGetAllAssignedExceDesignQuery, useGetExecutiveAllUpcomingListQuery, useSendRequestForSubmissionMutation } from "@/api/design/executive/assigned-design/assigned-designs.api";
import { toast } from "react-toastify";

const DesignsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [timing, setTiming] = useState("");
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const { type } = useParams();

  const [sendAssignMentRequest, { isUpading }] = useSendRequestForSubmissionMutation();

  // Memoize decision to prevent infinite query refetches
  const decision = useMemo(() => {
    switch (type) {
      case "received":
        return "accepted";
      case "flag-raised":
        return "flag";
      case "declined":
        return "decline";
      default:
        return "";
    }
  }, [type]);

  // console.log("type ", type);
  const navigate = useNavigate();


  // const isLoading = false;
  // const isFetching = false;

  const isUpcomingDesigns = type == "upcoming";
  const isNextDayPlanning = type === "next-day-planning";
  const isTodayDesigns = type == "today";
  const isWaitingLostDesigns = ["waiting", "lost"].includes(type);
  const isDecisionDesigns = ["assigned", "flag-raised", "declined", "received"].includes(type);

  console.log('type:>', type)

  // dummy data
  const designDummyData = [
    {
      id: "1",
      designId: "DSN-001",
      client: "Tata Motors",
      productName: "LED Board",
      totalProducts: 5,
      projectName: "Showroom Branding",
      priority: "High",
      createdAt: "2025-09-01",
      deadline: "2025-09-05",
      leadType: "High",
    },
    {
      id: "2",
      designId: "DSN-002",
      client: "Mahindra",
      productName: "Neon Sign",
      projectName: "Dealer Outlet",
      totalProducts: 2,
      priority: "Medium",
      createdAt: "2025-09-02",
      deadline: "2025-09-06",
      leadType: "Medium",
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
      deadline: "2025-09-10",
      leadType: "Low",
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
      deadline: "2025-09-01",
      leadType: "High",
    },
  ];

  // FILTER STATES (PARENT)
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("");

  const filteredData = useMemo(() => {
    return designDummyData.filter((item) => {
      const matchPriority =
        priority === "" || item.priority.toLowerCase() === priority;

      return matchPriority;
    });
  }, [priority, designDummyData]);

  //  PAGE LEVEL LOGIC
  const handleView = (row) => {
    if (type == "waiting") {
      navigate(`/design/executive/designs/waiting-view/${type}/${row.id}`, {
        state: {
          title: config.title,
        },
      });
    } else if (type == "assigned") {
      navigate(`/design/executive/designs/assigned-view/${type}/${row.id}`, {
        state: {
          title: config.title,
          page: "view",
        },
      });
    } else if (type == "next-day-planning") {
      navigate(`/design/executive/designs/next-day-planning/${row.id}`, {
        state: {
          title: config.title,
          page: "next-day-planning",
        },
      });
    } else if (type == "today") {
      navigate(`/design/executive/designs/today/${row.id}`, {
        state: {
          title: config.title,
          page: "today",
        },
      });
    } else if (type == "received") {
      navigate(`/design/executive/designs/received/${row.id}`, {
        state: {
          title: config.title,
          page: "received",
        },
      });
    } else if (type == "flag-raised") {
      navigate(`/design/executive/designs/flag-raised-view/${row.id}`, {
        state: {
          title: config.title,
          page: "flag-raised",
        },
      });
    }
  };

  const handleDesignReport = (row) => {
    // yaha modal / pdf / report page open kara sakte ho
  };

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleSubmitRequest = (row) => {
    // 1️ Row ka data store karo
    setSelectedRow(row);

    // 2️ Modal open karo
    setRequestModalOpen(true);
  };

  const handleFinalSubmit = async (remark) => {
    // const payload = {
    //   designId: selectedRow?.designId,
    //   orderId: selectedRow?.orderId,
    //   remark: remark,
    //   requestType: "DESIGN_CHANGE",
    // };


    try {

      const payload = {
        id: selectedRow?.designId,
        remark: remark,
      };
      const res = await sendAssignMentRequest({ data: payload }).unwrap();

      toast.success(res?.data?.message ?? res?.message ?? "Submitted Successfully.")

    } catch (err) {
      toast.error(err?.data?.message ?? err?.error?.message ?? err?.message ?? "Failed to send.")
    }

    // API call
    setRequestModalOpen(false);
    setSelectedRow(null);
  };

  //  config generated here
  const designTypeConfig = getDesignTypeConfig({
    onView: handleView,
    onDesignReport: handleDesignReport,
    submitRequestDesign: handleSubmitRequest,
  });

  const config = designTypeConfig[type];

  if (!config) {
    return (
      <p className="h-full w-full flex justify-center items-center text-red-500">
        Route Not Exist
      </p>
    );
  }

  //   const {
  //   data,
  //   isLoading,
  //   isFetching,
  // } = useGetDesignsQuery(
  //     : skipToken
  // );



  // Memoize query parameters to prevent infinite refetches
  const nextDayParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
  }), [currentPage, itemsPerPage]);

  const todayParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage
  }), [currentPage, itemsPerPage]);

  const waitingLostParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    status: type,
    type: "self"
  }), [currentPage, itemsPerPage, type]);

  const decisionParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    ...(decision ? { decision: decision } : {})
  }), [currentPage, itemsPerPage, decision]);

  const upcomingParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage
  }), [currentPage, itemsPerPage]);

  // ===================== start api section =================

  const {
    data: nextDayData,
    isLoading: nextDayLoading,
    isFetching: nextDayFetching,
    error: nextDayError
  } = useGetAllNextDayPlanningQuery(nextDayParams, {
    skip: !isNextDayPlanning
  })

  const {
    data: todayDesignData,
    isLoading: todayLoading,
    isFetching: todayFetching,
    error: todayError
  } = useGetAllTodayDesignsQuery(todayParams, {
    skip: !isTodayDesigns
  })

  const {
    data: waitingLostData,
    isLoading: waitingLostLoading,
    isFetching: waitingLostFetching,
    error: waitingLostError
  } = useGetAllWaitingLostExceDesignsQuery(waitingLostParams, {
    skip: !isWaitingLostDesigns
  })

  const {
    data: decisionData,
    isLoading: decisionLoading,
    isFetching: decisionFetching,
    error: decisionError
  } = useGetAllAssignedExceDesignQuery(decisionParams, {
    skip: !isDecisionDesigns
  })

  const {
    data: upcomingData,
    isLoading: upcomingLoading,
    isFetching: upcomingFetching,
    error: upcomingError
  } = useGetExecutiveAllUpcomingListQuery(upcomingParams, {
    skip: !isUpcomingDesigns
  })

  // ===================== end api section ===================

  // ===== data via the types
  const apiStateByType = {
    "next-day-planning": {
      data: nextDayData,
      isLoading: nextDayLoading,
      isFetching: nextDayFetching,
      error: nextDayError
    },
    "today": {
      data: todayDesignData,
      isLoading: todayLoading,
      isFetching: todayFetching,
      error: todayError
    },
    "assigned": {
      data: decisionData,
      isLoading: decisionLoading,
      isFetching: decisionFetching,
      error: decisionError
    },
    "received": {
      data: decisionData,
      isLoading: decisionLoading,
      isFetching: decisionFetching,
      error: decisionError
    },
    "flag-raised": {
      data: decisionData,
      isLoading: decisionLoading,
      isFetching: decisionFetching,
      error: decisionError
    },
    "declined": {
      data: decisionData,
      isLoading: decisionLoading,
      isFetching: decisionFetching,
      error: decisionError
    },
    "waiting": {
      data: waitingLostData,
      isLoading: waitingLostLoading,
      isFetching: waitingLostFetching,
      error: waitingLostError
    },
    "lost": {
      data: waitingLostData,
      isLoading: waitingLostLoading,
      isFetching: waitingLostFetching,
      error: waitingLostError
    },
    "upcoming": {
      data: upcomingData,
      isLoading: upcomingLoading,
      isFetching: upcomingFetching,
      error: upcomingError
    }
  }


  const EMPTY_API_STATE = {
    data: null,
    isLoading: false,
    isFetching: false,
    error: null
  }

  const { data, isLoading, isFetching, error } = apiStateByType[type] ?? EMPTY_API_STATE;

  return (
    <div className="px-5">
      <DesignsHeader
        title={config.title}
        /*  HIDE FOR NEXT-DAY-PLANNING */
        showDateFilter={
          isNextDayPlanning ? true : config.endpoint !== "upcoming"
        }
        showPriorityFilter={
          isNextDayPlanning
            ? false
            : config.endpoint !== "completed" && config.endpoint !== "upcoming"
        }
        onDateChange={setDate}
        onPriorityChange={setPriority}
        /*  SHOW ONLY FOR NEXT-DAY-PLANNING */
        showTimingFilter={isNextDayPlanning}
        selectedTiming={timing}
        onTimingChange={setTiming}
        showPlanningLogsBtn={isNextDayPlanning}
        onPlanningLogsClick={() => setShowPlanningModal(true)}
      />

      <DesignsTable
        columnArray={config.columnArray}
        tableData={filteredData}
        total={designDummyData.length}
        isLoading={isLoading || isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />

      <RequestModal
        isOpen={requestModalOpen}
        onClose={() => {
          setRequestModalOpen(false);
          setSelectedRow(null);
        }}
        onSubmit={(remark) => handleFinalSubmit(remark)}
      />
    </div>
  );
};

export default DesignsPage;

