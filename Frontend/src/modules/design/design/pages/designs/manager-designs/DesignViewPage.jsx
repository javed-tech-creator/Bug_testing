import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import DesignsTable from "../../components/designs/DesignsTable";
// import DesignsHeader from "../../components/designs/DesignHeader";
import { getManagerDesignTypes } from "@/modules/design/config/ManagerDesignTypes";
import DesignsHeader from "@/modules/design/components/designs/DesignHeader";
import DesignsTable from "@/modules/design/components/designs/DesignsTable";
import AssignmentModal from "@/modules/design/components/designs/manager/AssignmentModal";
import { User, Users } from "lucide-react";
import { useGetAllDesignRequestedByDecisionQuery, useGetAllFlagDeclinedTeamDesignQuery } from "@/api/design/manager/design-bt-decision/design.requested.api";
import { useGetAllNextDayPlanningQuery } from "@/api/design/manager/next-day-planning/nextdayplanning.api";
import { useGetAllTodayDesignsQuery } from "@/api/design/manager/today-designs/todayDesigns.api";
import { useGetAllLostWaitingQuery } from "@/api/design/manager/lost-waiting/lost-waiting.api";
import { useGetAllAssignedDesignsQuery } from "@/api/design/manager/assigned-design/assigned-design.api";

const DesignViewPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [mode, setMode] = useState("self");
  const [timing, setTiming] = useState("");
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const { type } = useParams();

  console.log('type:>', type)
  console.log('mode:>', mode)

  const [decision, setDecision] = useState("");

  useEffect(() => {
    switch (type) {
      case "declined":
        setDecision("decline");
        setDecision("decline");
        break;

      case "received":
        setDecision("accepted");
        setDecision("accepted");
        break;

      case "flag-raised":
        setDecision("flag");
        setDecision("flag");
        break;

      case "new-designs":
        setDecision("pending");
        break;

      default:
        setDecision("");
    }
  }, [type]);
  console.log("type ", type);

  const isRecceInDesign = type == "recce-in-design";
  const isNextDayPlanning = type == "next-day-planning";
  const isTodayDesigns = type == "today";
  const isLostWaiting = ["waiting", "lost"].includes(type);
  const isAssigned = type == "assigned";
  const isFlagOrDeclinedTeam = (["flag-raised", "declined"].includes(type) && (mode == "team"));

  const navigate = useNavigate();


  // ================[ api calling according to the types start ]======================

  // get recce-in-design, received, flag, delined api & states
  const {
    data: decisionData,
    error: decisionError,
    isLoading: decisionLoading,
    isFetching: decisionFetching,
  } = useGetAllDesignRequestedByDecisionQuery({
    page: currentPage,
    limit: itemsPerPage,
    decision: decision, // or pending / rejected
  },
    {
      skip: !(["recce-in-design", "received", "flag-raised", "declined"].includes(type) && mode === "self"),
    });

  // get the flag and declined api when mode - team  

  const {
    data: flagDeclinedTeamData,
    isLoading: flagDeclinedTeamLoading,
    isFetching: flagDeclinedTeamFetching,
    error: flagDeclinedTeamError
  } = useGetAllFlagDeclinedTeamDesignQuery({
    page: currentPage,
    limit: itemsPerPage,
    type: decision
  }, {
    skip: !isFlagOrDeclinedTeam
  })

  // get next day api & states
  const {
    data: nextDayData,
    error: nextDayError,
    isLoading: nextDayLoading,
    isFetching: nextDayFetching
  } = useGetAllNextDayPlanningQuery({
    page: currentPage,
    limit: itemsPerPage,
    decision: decision
  },
    {
      skip: !isNextDayPlanning
    }
  );

  // get today api & states
  const {
    data: todayData,
    error: todayError,
    isLoading: todayLoading,
    isFetching: todayFetching,
  } = useGetAllTodayDesignsQuery({
    page: currentPage,
    limit: itemsPerPage,
    decision: decision
  },
    {
      skip: !isTodayDesigns,
      refetchOnMountOrArgChange: true
    })

  // get lost/waiting design api & states
  const {
    data: waitingLostData,
    isLoading: waitingLostLoading,
    isFetching: waitingLostFetching,
    error: waitingLostError
  } = useGetAllLostWaitingQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: type,
    type: mode
  }, {
    skip: !isLostWaiting
  })

  // get the all assigned designs api & state
  const {
    data: assignedData,
    isLoading: assignedLoading,
    isFetching: assignedFetching,
    error: assignedError
  } = useGetAllAssignedDesignsQuery({
    page: currentPage,
    limit: itemsPerPage,
    assignment_type: mode
  }, {
    skip: !isAssigned
  })

  const apiStateByType = {
    "recce-in-design": {
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
    "next-day-planning": {
      data: nextDayData,
      isLoading: nextDayLoading,
      isFetching: nextDayFetching,
      error: nextDayError
    },
    "today": {
      data: todayData,
      isLoading: todayLoading,
      isFetching: todayFetching,
      error: todayError
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
    "assigned": {
      data: assignedData,
      isLoading: assignedLoading,
      isFetching: assignedFetching,
      error: assignedError
    },
    "flag-raised": {
      data: flagDeclinedTeamData,
      isLoading: flagDeclinedTeamLoading,
      isFetching: flagDeclinedTeamFetching,
      error: flagDeclinedTeamError
    },
    "declined": {
      data: flagDeclinedTeamData,
      isLoading: flagDeclinedTeamLoading,
      isFetching: flagDeclinedTeamFetching,
      error: flagDeclinedTeamError
    }
  }

  const activeApiState = apiStateByType[type] || {
    data: null,
    isLoading: false,
    isFetching: false,
    error: null
  };

  const { data, isLoading, isFetching, error } = activeApiState;


  // [ end api calling according to the types  ]


  useEffect(() => {
    console.log("data received", data);
  }, [data]);
  console.log("data is coming", data);


  // dummy data
  const designDummyData = [
    {
      id: "1",
      designId: "DSN-001",
      client: "Tata Motors1",
      productName: "LED Board",
      totalProducts: 5,
      manager_status: "decline",
      remark: "finally ok",
      assigned: "Rahul Singh",
      raised_by: "Rahul Singh",
      projectName: "Showroom Branding",
      priority: "High",
      createdAt: "2025-09-01",
      askingTime: "11 Nov 25, 10:30AM",
      status: "Hold by Company",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      flagType: "Red",
      lastIntractionDate: "11 Nov 25, 10:30AM",
    },
    {
      id: "2",
      designId: "DSN-002",
      client: "Mahindra",
      productName: "Neon Sign",
      manager_status: "waiting_for_acceptance",
      remark: "finally ok",
      projectName: "Dealer Outlet",
      assigned: "Shyam Singh",
      raised_by: "Shyam Singh",
      totalProducts: 2,
      priority: "Medium",
      createdAt: "2025-09-02",
      status: "Postponed by Company",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      askingTime: "11 Nov 25, 10:30AM",
      flagType: "Yellow",
      lastIntractionDate: "11 Nov 25, 10:30AM",
    },
    {
      id: "3",
      designId: "DSN-003",
      client: "Hyundai",
      productName: "Glow Sign",
      manager_status: "decline",
      remark: "finally ok",
      projectName: "Service Center",
      totalProducts: 8,
      assigned: "Ronak Singh",
      raised_by: "Ronak Singh",
      askingTime: "11 Nov 25, 10:30AM",
      priority: "Low",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      status: "Postponed by Client",
      createdAt: "2025-09-03",
      flagType: "Green",
      lastIntractionDate: "11 Nov 25, 10:30AM",
    },
    {
      id: "4",
      designId: "DSN-004",
      client: "Maruti Suzuki",
      productName: "ACP Signage",
      manager_status: "accepted",
      remark: "finally not ok",
      assigned: "Modi Singh",
      raised_by: "Modi Singh",
      askingTime: "11 Nov 25, 10:30AM",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      projectName: "Workshop Board",
      status: "Hold by Client",
      totalProducts: 5,
      priority: "High",
      createdAt: "2025-08-28",
      flagType: "Red",
      lastIntractionDate: "11 Nov 25, 10:30AM",
    },
  ];

  const [selectedExecutive, setSelectedExecutive] = useState("");

  const executivesList = [
    { _id: "u1", name: "Rahul" },
    { _id: "u2", name: "Amit" },
    { _id: "u3", name: "Neha" },
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
    if (type == "next-day-planning") {
      navigate(`/design/manager/designs/${type}/${row.id}`, {
        state: {
          title: config.title,
        },
      });
    } else if (type == "recce-in-design") {
      navigate(`/design/manager/designs/received/${type}/${row.id}`, {
        state: {
          title: config.title,
        },
      });
    } else if (type == "today") {
      navigate(`/design/manager/designs/${type}/${row.id}`, {
        state: {
          title: config.title,
        },
      });
    }
    // /design/manager/designs/today/:id
    // } else if (type == "assigned") {
    //   navigate(`/design/executive/designs/assigned-view/${type}/${row.id}`, {
    //     state: {
    //       title: config.title,
    //       page: "view",
    //     },
    //   });
    // } else if (type == "today") {
    //   navigate(`/design/executive/designs/today/${row.id}`, {
    //     state: {
    //       title: config.title,
    //       page: "today",
    //     },
    //   });
    // } else if (type == "received") {
    //   navigate(`/design/executive/designs/recieved/${row.id}`, {
    //     state: {
    //       title: config.title,
    //       page: "recieved",
    //     },
    //   });
    // }else if (type == "flag-raised") {
    //   navigate(`/design/executive/designs/flag-raised-view/${row.id}`, {
    //     state: {
    //       title: config.title,
    //       page: "flag-raised",
    //     },
    //   });
    // }
  };

  const handleDesignReport = (row) => {
    console.log("Design Report", row);
    // yaha modal / pdf / report page open kara sakte ho
  };
  // const handleSubmitReassigInNextDay = (row) => {
  //   setOpen(true);
  //   // yaha modal / pdf / report page open kara sakte ho
  // };

  const [open, setOpen] = useState(false);
  const handleSubmitAssign = (row) => {
    setOpen(true);
  };

  //  config generated here
  const designTypeConfig = getManagerDesignTypes({
    onView: handleView,
    onDesignReport: handleDesignReport,
    submitAssign: handleSubmitAssign,
    // submitReassign: handleSubmitAssign,
    // submitReassigInNextDay: handleSubmitReassigInNextDay,
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

  // const isLoading = false;
  // const isFetching = false;

  const showExecutive =
    type === "upcoming" ||
    type === "next-day-planning" ||
    type === "received" ||
    type === "recce-in-design" ||
    type === "today";

  return (
    <div className="px-5">
      <DesignsHeader
        title={config.title}
        showDateFilter={config.endpoint === "upcoming" ? false : true}
        showPriorityFilter={
          config.endpoint === "completed" ||
            config.endpoint === "next-day-planning" ||
            config.endpoint === "upcoming"
            ? false
            : true
        }
        onDateChange={setDate}
        onPriorityChange={setPriority}
        /*  EXECUTIVE FILTER – FIXED */
        showExecutiveFilter={showExecutive === false}
        executives={executivesList}
        onExecutiveChange={(userId) => {
          setSelectedExecutive(userId);
          // yahin se API / filter call
        }}
        /*  SHOW ONLY FOR NEXT-DAY-PLANNING */
        showTimingFilter={isNextDayPlanning}
        selectedTiming={timing}
        onTimingChange={setTiming}
        showPlanningLogsBtn={isNextDayPlanning}
        onPlanningLogsClick={() => setShowPlanningModal(true)}
      />

      {type !== "incoming" &&
        type !== "my-received" &&
        type !== "today" &&
        type !== "upcoming" &&
        type !== "next-day-planning" &&
        type !== "recce-in-design" &&
        type !== "received" && (
          <div className="flex w-full items-center justify-center mb-4">
            <div className="relative flex w-96 bg-emerald-50 rounded-lg p-1">
              <div
                className={`absolute top-1 bottom-1 rounded-md transition-all duration-300
      ${mode === "self"
                    ? "left-1 right-1/2 bg-emerald-600"
                    : "left-1/2 right-1 bg-teal-600"
                  }`}
              />

              <div className="relative flex w-full">
                <button
                  onClick={() => setMode("self")}
                  className={`flex-1 px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2
        ${mode === "self" ? "text-white" : "text-emerald-800"}`}
                >
                  <User className="w-4 h-4" />
                  Self
                </button>

                <button
                  onClick={() => setMode("team")}
                  className={`flex-1 px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2
        ${mode === "team" ? "text-white" : "text-teal-800"}`}
                >
                  <Users className="w-4 h-4" />
                  Team
                </button>
              </div>
            </div>
          </div>
        )}

      <DesignsTable
        columnArray={config.columnArray}
        tableData={filteredData}
        total={designDummyData.length}
        isLoading={isLoading || isFetching}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        // showActiveFilter={true} //  enable here only
        // isActive={isActive}
        // setIsActive={setIsActive}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />

      <AssignmentModal
        isOpen={open}
        onClose={() => setOpen(false)}
        mode={type !== "assigned" ? "assign" : "reassign"}
      />
    </div>
  );
};

export default DesignViewPage;
