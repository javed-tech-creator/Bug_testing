import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAssignedRecceQuery } from "@/api/admin/assignedRecce.api";
import { useSelector } from "react-redux";

const stages = [
  {
    title: "Possible Recce",
    totalLabel: "Total Recce",
    totalValue: 100,
    color: "bg-purple-200 border-purple-500",
    tagColor: "bg-purple-700",
    cards: [
      {
        title: "Tomorrow",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Tomorrow Onward",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Todays",
        stats: [
          { label: "Total Projects", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Recce Assigned",
    totalLabel: "Total Recce",
    totalValue: 150,
    color: "bg-orange-100 border-red-300",
    tagColor: "bg-orange-600",
    cards: [
      {
        title: "Tomorrow",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Tomorrow Onward",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Todays",
        stats: [
          { label: "Total Projects", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Accepted / Assigned Recce + Inhouse & Outbound",
    totalLabel: "Total Recce",
    totalValue: 150,
    color: "bg-green-100 border-green-300",
    tagColor: "bg-green-600",
    cards: [
      {
        title: "Tomorrow",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Tomorrow Onward",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Todays",
        stats: [
          { label: "Total Projects", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Waiting Recce",
    totalLabel: "Total Recce",
    totalValue: 50,
    color: "bg-yellow-100 border-yellow-300",
    tagColor: "bg-yellow-600",
    cards: [
      {
        title: "Tomorrow",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Tomorrow Onward",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Todays",
        stats: [
          { label: "Total Projects", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Next Day Recce Planning",
    totalLabel: "Total Recce",
    totalValue: 100,
    color: "bg-purple-100 border-purple-300",
    tagColor: "bg-purple-800",
    cards: [
      {
        title: "Todays Planning",
        stats: [
          { label: "Total Projects", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Tomorrow Planning",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
      {
        title: "Tomorrow Onward Planning",
        stats: [
          { label: "Total Racce", value: 80 },
          { label: "Total Products", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Today’s Recce",
    totalLabel: "Total Recce",
    totalValue: 50,
    color: "bg-red-100 border-red-300",
    tagColor: "bg-red-600",
    cards: [
      {
        title: "Todays",
        stats: [
          { label: "Total Projects", value: 25 },
          { label: "Total Products", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Recce Flow",
    totalLabel: "Total Projects",
    totalValue: 50,
    totalProducts: "Total Products",
    productsValue: 100,
    color: "bg-green-100 border-green-300",
    tagColor: "bg-green-600",
    cards: [
      {
        title: "Informed Client for Visit",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "Recce In",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "Client Interaction",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "Raw Recce Filled",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "Product Confirmation",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "Recce Form",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "All Signage Name Confirmed",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "Ask Client & Project Dept to Learn",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
    ],

    cards2: [
      {
        title: "Environmental Condition",
        stats: [
          { label: "Products", value: 25 },
          { label: "Projects", value: 10 },
        ],
      },
      {
        title: "Products Requirement",
        stats: [
          { label: "Products", value: 25 },
          { label: "Projects", value: 10 },
        ],
      },
      {
        title: "Image Sections",
        stats: [
          { label: "Products", value: 25 },
          { label: "Projects", value: 10 },
        ],
      },
      {
        title: "Video Sections",
        stats: [
          { label: "Products", value: 25 },
          { label: "Projects", value: 10 },
        ],
      },
      {
        title: "Installation Details",
        stats: [
          { label: "Total Products", value: 25 },
          { label: "Total Projects", value: 10 },
        ],
      },
      {
        title: "Data From Clients",
        stats: [
          { label: "Products", value: 25 },
          { label: "Projects", value: 10 },
        ],
      },
      {
        title: "Instructions or Remarks",
        stats: [
          { label: "Products", value: 25 },
          { label: "Projects", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Recce Reviews",
    totalLabel: "Total Recce",
    totalValue: 150,
    color: "bg-blue-100 border-blue-300",
    tagColor: "bg-blue-700",
    cards: [
      {
        title: "Completed Recce",
        stats: [
          { label: "Projects", value: 60 },
          { label: "Products", value: 10 },
        ],
      },
      {
        title: "Submitted Reports",
        stats: [
          { label: "Projects", value: 60 },
          { label: "Products", value: 10 },
        ],
      },
      {
        title: "Approved By Manager",
        stats: [
          { label: "Projects", value: 60 },
          { label: "Products", value: 10 },
        ],
      },
      {
        title: "Flag Raised",
        stats: [
          { label: "Projects", value: 60 },
          { label: "Products", value: 10 },
        ],
      },
      {
        title: "Recce Ratings",
        stats: [
          { label: "Projects", value: 60 },
          { label: "Products", value: 10 },
        ],
      },
    ],
  },
  {
    title: "Completed Recce",
    totalLabel: "Total Completed Recce",
    totalValue: 150,
    color: "bg-blue-100 border-blue-300",
    tagColor: "bg-blue-700",
    cards: [
      {
        title: "Final Approved Recce",
        stats: [
          { label: "Projects", value: 60 },
          { label: "Products", value: 10 },
        ],
      },
    ],
  },
];

const dummyPersonData = [
  { name: "Amit Verma", totalRecce: 42 },
  { name: "Priya Sharma", totalRecce: 57 },
  { name: "Rahul Verma", totalRecce: 31 },
  { name: "Suresh Iyer", totalRecce: 26 },
  { name: "Vikram Singh", totalRecce: 19 },
];

const RecceFunnel = () => {
  const { data: assignedRecceRes, isLoading } = useGetAssignedRecceQuery();
  const apiTotalRecce = assignedRecceRes?.data?.total ?? 0;
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth?.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();
  const normalizedRole =
    {
      executive: "executive",
      "recce executive": "executive",
      manager: "manager",
      "recce manager": "manager",
      hod: "manager",
      "recce hod": "manager",
    }[role] || "executive";
  const isManager = normalizedRole === "manager";

  const [selectedPerson, setSelectedPerson] = useState("all");

  const personOptions = useMemo(
    () => dummyPersonData.map((item) => item.name),
    []
  );

  const totalRecce = useMemo(() => {
    if (!isManager) return apiTotalRecce;
    if (selectedPerson === "all") {
      return dummyPersonData.reduce(
        (sum, item) => sum + (item.totalRecce || 0),
        0
      );
    }
    return (
      dummyPersonData.find((item) => item.name === selectedPerson)
        ?.totalRecce || 0
    );
  }, [apiTotalRecce, isManager, selectedPerson]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between px-10 pt-4">
        <h2 className="text-xl font-bold text-black">
          Funnel Visualization
        </h2>
        {isManager && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter:</span>
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm bg-white"
            >
              <option value="all">All</option>
              {personOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 min-h-[74vh] px-10">
        {/* Possible Recce */}
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => navigate("/recce/possible-recce")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[0].tagColor} rounded-sm shadow cursor-pointer hover:bg-purple-800`}
          >
            {stages[0].title}
          </button>
          {/* CYLINDER */}
          <div
            className={`
    relative min-w-[450px] sm:min-w-[550px] lg:min-w-[800px] h-[280px]
    ${stages[0].color}
    flex flex-col items-center justify-start shadow-sm
    px-20 pt-6 pb-4 rounded-r-md
  `}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-35px] top-1/2 -translate-y-1/2
      z-3 bg-purple-200 
      border-l-2 ${stages[0].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "280px",
                width: "90px",
                borderRadius: "45px / 170px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-28px] top-1/2 -translate-y-1/2
      z-3 bg-purple-200
      border-2 ${stages[0].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "280px",
                width: "70px",
                borderRadius: "35px / 140px",
              }}
            ></div>

            {/* TOTAL */}
            <p className="mt-5 text-[11px] sm:text-sm font-semibold text-purple-900">
              {stages[0].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* CARDS */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3 w-full z-3">
              {stages[0].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-purple-900 border-b border-gray-200 text-white truncate">
                    {card.title}
                  </div>
                  <div className="p-2">
                    <div className="flex justify-between gap-1 font-semibold mb-1 ">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px] font-semibold text-blue-500"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*  Recce Assign*/}
        <div className="flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            onClick={() => navigate("/recce/assigned-recce")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[1].tagColor} rounded-sm shadow hover:bg-orange-700 cursor-pointer`}
          >
            {stages[1].title}
          </button>

          {/* CYLINDER */}
          <div
            className={`relative min-w-[450px] sm:min-w-[550px] lg:min-w-[800px] h-[260px]  ${stages[1].color} flex flex-col items-center justify-start shadow-sm px-20 pt-6 pb-4 rounded-r-lg rounded-l-lg`}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-32px] top-1/2 -translate-y-1/2
      z-3 bg-orange-100 
      border-l-2 ${stages[1].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "260px",
                width: "84px",
                borderRadius: "42px / 130px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-30px] top-1/2 -translate-y-1/2
      z-3 bg-orange-100
      border-2 ${stages[1].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "260px",
                width: "84px",
                borderRadius: "42px / 130px",
              }}
            ></div>

            {/* TOTAL */}
            <p className="mt-4 text-[11px] sm:text-sm font-semibold text-orange-600">
              {stages[1].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* INNER CARDS */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3 w-full z-3">
              {stages[1].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-orange-600 text-white border-b border-gray-200 truncate">
                    {card.title}
                  </div>
                  <div className="p-2">
                    {/* header row */}
                    <div className="flex justify-between gap-1 font-semibold mb-1">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    {/* values row */}
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px] font-semibold text-blue-500"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Accepted Recce */}
        <div className="flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            onClick={() => navigate("/recce/received-accepted-recce")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[2].tagColor} rounded-sm shadow cursor-pointer hover:bg-green-700`}
          >
            {stages[2].title}
          </button>

          {/* CYLINDER */}
          <div
            className={`relative min-w-[450px] sm:min-w-[550px] lg:min-w-[800px] h-[240px] ${stages[2].color} flex flex-col items-center justify-start shadow-sm px-20 pt-6 pb-4 rounded-r-lg `}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-38px] top-1/2 -translate-y-1/2
      z-3 bg-green-100
      border-l-2 ${stages[2].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "240px",
                width: "77px",
                borderRadius: "38px / 120px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-30px] top-1/2 -translate-y-1/2
      z-3 bg-green-100
      border-2 ${stages[2].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "240px",
                width: "77px",
                borderRadius: "38px / 120px",
              }}
            ></div>

            {/* TOTAL */}
            <p className="mt-2 text-[11px] sm:text-sm font-semibold text-green-600 ">
              {stages[2].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* INNER CARDS */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3 w-full z-3">
              {stages[2].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-green-600 border-b text-white border-gray-200 truncate">
                    {card.title}
                  </div>
                  <div className="px-2 py-2">
                    {/* header row */}
                    <div className="flex justify-between gap-1 font-semibold mb-1">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    {/* values row */}
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px] font-semibold text-blue-500"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Waiting Recce */}
        <div className="relative flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            onClick={() => navigate("/recce/waiting-recce")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[3].tagColor} rounded-sm shadow cursor-pointer hover:bg-yellow-700`}
          >
            {stages[3].title}
          </button>
          {/* CYLINDER */}
          <div
            className={`relative min-w-[450px] sm:min-w-[550px] lg:min-w-[800px] h-[220px] ${stages[3].color} flex flex-col items-center justify-start shadow-sm px-20 pt-6 pb-4 rounded-r-lg`}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-38px] top-1/2 -translate-y-1/2
      z-3 bg-yellow-100
      border-l-2 ${stages[3].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "220px",
                width: "70px",
                borderRadius: "35px / 110px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-30px] top-1/2 -translate-y-1/2
      z-3 bg-yellow-100
      border-2 ${stages[3].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "220px",
                width: "70px",
                borderRadius: "35px / 110px",
              }}
            ></div>

            {/* TOTAL */}
            <p className="mt-2 text-[11px] sm:text-sm font-semibold text-yellow-600">
              {stages[3].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* INNER CARDS */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              {stages[3].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-yellow-500 text-white border-b border-gray-200 truncate">
                    {card.title}
                  </div>
                  <div className="px-2 py-2">
                    {/* header row */}
                    <div className="flex justify-between gap-1 font-semibold mb-1">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    {/* values row */}
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px] text-blue-500 font-semibold"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <CylinderStats/> */}
          <div className="absolute -bottom-38 w-full flex flex-col items-center ">
            {/* CYLINDER WRAPPER */}
            <div className="relative flex flex-col items-center bg-blue-100 w-30 h-28 rounded-md">
              {/* TOP RUPEE VALUES */}
              <div className="absolute -top-14 z-3 flex flex-col items-center gap-3 text-red-600 font-bold text-sm leading-4">
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
              </div>

              {/* TOP ELLIPSE */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 
             bg-blue-100 border-2 border-blue-600"
                style={{
                  width: "120px", // ellipse width
                  height: "25px", // ellipse height
                  borderRadius: "60px / 12.5px", // horizontal ellipse
                }}
              ></div>

              {/* CENTER VALUES */}
              <div className="mt-6 flex flex-col gap-1 w-full items-center">
                {/* Hot */}
                <div className="bg-red-600 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Hot: 750
                </div>

                {/* Cold */}
                <div className="bg-blue-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Cold: 750
                </div>

                {/* Warm */}
                <div className="bg-yellow-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow z-3">
                  Warm: 750
                </div>
              </div>

              {/* BOTTOM ELLIPSE */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-100 border-b-2 border-blue-600"
                style={{
                  width: "120px",
                  height: "25px",
                  borderRadius: "60px / 12px",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Next day Recce planning */}
        <div className=" relative flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            onClick={() => navigate("/recce/next-day-recce-planning")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[4].tagColor} rounded-sm shadow cursor-pointer hover:bg-purple-900`}
          >
            {stages[4].title}
          </button>

          {/* CYLINDER */}
          <div
            className={`relative min-w-[450px] sm:min-w-[550px] lg:min-w-[800px] h-[200px]  ${stages[4].color} flex flex-col items-center justify-start shadow-sm px-20 pt-6 pb-4 rounded-r-lg  `}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-32px] top-1/2 -translate-y-1/2
      z-3 bg-purple-100
      border-l-2 ${stages[4].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "200px",
                width: "64px",
                borderRadius: "32px / 100px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-30px] top-1/2 -translate-y-1/2
      z-3 bg-purple-100
      border-2 ${stages[4].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "200px",
                width: "64px",
                borderRadius: "32px / 100px",
              }}
            ></div>

            {/* TOTAL */}
            <p className="mt-2 text-[11px] sm:text-sm font-semibold text-blue-600">
              {stages[4].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* INNER CARDS */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3 w-full">
              {stages[4].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-blue-900 border-b text-white border-gray-200 truncate">
                    {card.title}
                  </div>
                  <div className="px-2 py-2">
                    {/* header row */}
                    <div className="flex justify-between gap-1 font-semibold mb-1">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    {/* values row */}
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px] font-semibold text-blue-500"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <CylinderStats/> */}
          <div className="absolute -bottom-40 w-full flex flex-col items-center ">
            {/* CYLINDER WRAPPER */}
            <div className="relative flex flex-col items-center bg-blue-100 w-30 h-28 rounded-md">
              {/* TOP RUPEE VALUES */}
              <div className="absolute -top-14 z-3 flex flex-col items-center gap-3 text-red-600 font-bold text-sm leading-4">
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
              </div>

              {/* TOP ELLIPSE */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 
             bg-blue-100 border-2 border-blue-600"
                style={{
                  width: "120px", // ellipse width
                  height: "25px", // ellipse height
                  borderRadius: "60px / 12.5px", // horizontal ellipse
                }}
              ></div>

              {/* CENTER VALUES */}
              <div className="mt-6 flex flex-col gap-1 w-full items-center">
                {/* Hot */}
                <div className="bg-red-600 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Hot: 750
                </div>

                {/* Cold */}
                <div className="bg-blue-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Cold: 750
                </div>

                {/* Warm */}
                <div className="bg-yellow-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow z-3">
                  Warm: 750
                </div>
              </div>

              {/* BOTTOM ELLIPSE */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-100 border-b-2 border-blue-600"
                style={{
                  width: "120px",
                  height: "25px",
                  borderRadius: "60px / 12px",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Todays Recce */}
        <div className="relative flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            onClick={() => navigate("/recce/todays-recce")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[5].tagColor} rounded-sm shadow cursor-pointer hover:bg-red-700`}
          >
            {stages[5].title}
          </button>
          {/* CYLINDER */}
          <div
            className={`relative min-w-[450px] sm:min-w-[550px] lg:min-w-[800px] h-[180px]  ${stages[5].color} flex flex-col items-center justify-start shadow-sm px-10 pt-6 pb-4  rounded-r-lg`}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-25px] top-1/2 -translate-y-1/2
      z-3 bg-red-100
      border-l-2 ${stages[5].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "180px",
                width: "58px",
                borderRadius: "29px / 90px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-23px] top-1/2 -translate-y-1/2
      z-3 bg-red-100
      border-2 ${stages[5].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "180px",
                width: "58px",
                borderRadius: "29px / 90px",
              }}
            ></div>

            {/* TOTAL */}
            <p className="mt-2 text-[11px] sm:text-sm font-semibold text-orange-600">
              {stages[5].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* INNER CARDS */}
            <div className="mt-1 flex items-center w-full justify-center ">
              {stages[5].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-orange-500 text-white border-b border-gray-200 truncate">
                    {card.title}
                  </div>
                  <div className="px-2 py-2">
                    {/* header row */}
                    <div className="flex justify-between gap-1 font-semibold mb-1">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    {/* values row */}
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px] text-blue-500 font-semibold"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <CylinderStats/> */}
          <div className="absolute -bottom-42 w-full flex flex-col items-center ">
            {/* CYLINDER WRAPPER */}
            <div className="relative flex flex-col items-center bg-blue-100 w-30 h-28 rounded-md">
              {/* TOP RUPEE VALUES */}
              <div className="absolute -top-14 z-3 flex flex-col items-center gap-3 text-red-600 font-bold text-sm leading-4">
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
              </div>

              {/* TOP ELLIPSE */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 
             bg-blue-100 border-2 border-blue-600"
                style={{
                  width: "120px", // ellipse width
                  height: "25px", // ellipse height
                  borderRadius: "60px / 12.5px", // horizontal ellipse
                }}
              ></div>

              {/* CENTER VALUES */}
              <div className="mt-6 flex flex-col gap-1 w-full items-center">
                {/* Hot */}
                <div className="bg-red-600 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Hot: 750
                </div>

                {/* Cold */}
                <div className="bg-blue-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Cold: 750
                </div>

                {/* Warm */}
                <div className="bg-yellow-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow z-3">
                  Warm: 750
                </div>
              </div>

              {/* BOTTOM ELLIPSE */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-100 border-b-2 border-blue-600"
                style={{
                  width: "120px",
                  height: "25px",
                  borderRadius: "60px / 12px",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Racce flow  */}
        <div className=" relative flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            onClick={() => navigate("/recce/recce-in")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[6].tagColor} rounded-sm shadow cursor-pointer hover:bg-green-700`}
          >
            {stages[6].title}
          </button>

          {/* CYLINDER */}
          <div
            className={`relative min-w-[450px] sm:min-w-[550px] lg:min-w-[3000px] h-[160px]  ${stages[6].color} flex flex-col items-center justify-start shadow-sm px-10 pt-2 pb-k4  rounded-r-lg`}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-25px] top-1/2 -translate-y-1/2
      z-3 bg-green-100
      border-l-2 ${stages[6].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "160px",
                width: "52px",
                borderRadius: "26px / 80px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-20px] top-1/2 -translate-y-1/2
      z-3 bg-green-100
      border-2 ${stages[6].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "160px",
                width: "52px",
                borderRadius: "26px / 80px",
              }}
            ></div>

            {/* TOTAL */}
            <p className=" text-[11px] text-start sm:text-sm font-semibold text-green-700">
              {stages[6].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            <div className="grid grid-cols-12 gap-3 w-full ">
              {/* LEFT SECTION - 8 COLUMNS */}
              <div className="col-span-12 lg:col-span-7 mt-4">
                <div className="grid grid-cols-2 md:grid-cols-8 gap-3 w-full ">
                  {stages[6].cards.map((card, cardIndex) => (
                    <div
                      key={cardIndex}
                      className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                    >
                      <div className="px-2 py-1 font-semibold bg-green-500 text-white border-b border-gray-200 truncate">
                        {card.title}
                      </div>

                      <div className="px-2 py-2">
                        {/* header row */}
                        <div className="flex justify-between gap-1 font-semibold mb-1">
                          {card.stats.map((s, idx) => (
                            <span
                              key={idx}
                              className="flex-1 text-center truncate"
                            >
                              {s.label}
                            </span>
                          ))}
                        </div>

                        {/* values row */}
                        <div className="flex justify-between gap-1">
                          {card.stats.map((s, idx) => (
                            <span
                              key={idx}
                              className="flex-1 text-center border rounded-sm py-[3px] text-blue-500 font-semibold"
                            >
                              {isLoading ? "..." : totalRecce}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SECTION - 4 COLUMNS */}
              <div className="col-span-12 lg:col-span-5">
                {/* MAIN HEADING */}
                <h2 className="text-center font-semibold bg-green-700 text-white py-1 mb-1 text-sm sm:text-base ">
                  Recce Form Filling
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-7 gap-3 w-full">
                  {stages[6].cards2.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                    >
                      <div className="px-2 py-1 font-semibold bg-green-600 text-white border-b border-gray-200 truncate">
                        {item.title}
                      </div>

                      <div className="px-2 py-2">
                        {/* header row */}
                        <div className="flex justify-between gap-1 font-semibold mb-1">
                          {item.stats.map((s, idx) => (
                            <span
                              key={idx}
                              className="flex-1 text-center text-gray-600 truncate"
                            >
                              {s.label}
                            </span>
                          ))}
                        </div>

                        {/* values row */}
                        <div className="flex justify-between gap-1">
                          {item.stats.map((s, idx) => (
                            <span
                              key={idx}
                              className="flex-1 text-center rounded-sm py-[3px] text-black font-semibold"
                            >
                              {isLoading ? "..." : totalRecce}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* <CylinderStats/> */}
          <div className="absolute -bottom-44 w-full flex flex-col items-center ">
            {/* CYLINDER WRAPPER */}
            <div className="relative flex flex-col items-center bg-blue-100 w-30 h-28 rounded-md">
              {/* TOP RUPEE VALUES */}
              <div className="absolute -top-14 z-3 flex flex-col items-center gap-3 text-red-600 font-bold text-sm leading-4">
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
                <span>₹0 ₹0</span>
              </div>

              {/* TOP ELLIPSE */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 
             bg-blue-100 border-2 border-blue-600"
                style={{
                  width: "120px", // ellipse width
                  height: "25px", // ellipse height
                  borderRadius: "60px / 12.5px", // horizontal ellipse
                }}
              ></div>

              {/* CENTER VALUES */}
              <div className="mt-6 flex flex-col gap-1 w-full items-center">
                {/* Hot */}
                <div className="bg-red-600 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Hot: 750
                </div>

                {/* Cold */}
                <div className="bg-blue-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow">
                  Cold: 750
                </div>

                {/* Warm */}
                <div className="bg-yellow-500 text-white text-xs font-semibold py-1 px-4 rounded-full shadow z-3">
                  Warm: 750
                </div>
              </div>

              {/* BOTTOM ELLIPSE */}
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-100 border-b-2 border-blue-600"
                style={{
                  width: "120px",
                  height: "25px",
                  borderRadius: "60px / 12px",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recce Reviews */}
        <div className="flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            // onClick={() => navigate("/recce/todays-recce")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[7].tagColor} rounded-sm shadow`}
          >
            {stages[7].title}
          </button>
          {/* CYLINDER */}
          <div
            className={`relative min-w-[450px] sm:min-w-[550px] lg:min-w-[850px] h-[140px] ${stages[7].color} flex flex-col items-center justify-start shadow-sm px-10 pt-3  rounded-r-md`}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-23px] top-1/2 -translate-y-1/2
      z-3 bg-blue-100
      border-l-2 ${stages[7].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "140px",
                width: "46px",
                borderRadius: "23px / 70px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-18px] top-1/2 -translate-y-1/2
      z-3 bg-blue-100
      border-2 ${stages[7].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "140px",
                width: "46px",
                borderRadius: "23px / 70px",
              }}
            ></div>

            {/* TOTAL */}
            <p className="mb-1 text-[11px] sm:text-sm font-semibold text-blue-500">
              {stages[7].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* INNER CARDS */}
            <div className=" grid grid-cols-2 lg:grid-cols-5 gap-3 w-full">
              {stages[7].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-blue-500 text-white border-b border-gray-200 truncate">
                    {card.title}
                  </div>
                  <div className="px-2 py-2">
                    {/* header row */}
                    <div className="flex justify-between gap-1 font-semibold mb-1">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    {/* values row */}
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px]  font-semibold"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Completed Recce */}
        <div className="flex flex-col gap-4 items-center">
          {/* TITLE PILL */}
          <button
            onClick={() => navigate("/recce/todays-recce")}
            className={`text-[11px] sm:text-xs text-white px-4 py-2 ${stages[8].tagColor} rounded-sm shadow`}
          >
            {stages[8].title}
          </button>
          {/* CYLINDER */}
          <div
            className={`relative min-w-[350px] sm:min-w-[350px] lg:min-w-[400px] h-[120px] ${stages[8].color} flex flex-col items-center justify-start shadow-sm px-10 pt-2   rounded-r-md`}
          >
            {/* LEFT ELLIPSE - OUTSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute left-[-20px] top-1/2 -translate-y-1/2
      z-3 bg-blue-100
      border-l-2 ${stages[8].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "120px",
                width: "40px",
                borderRadius: "20px / 60px",
              }}
            ></div>

            {/* RIGHT ELLIPSE - INSIDE FUNNEL */}
            <div
              className={`
      pointer-events-none absolute right-[-16px] top-1/2 -translate-y-1/2
      z-3 bg-blue-100
      border-2 ${stages[8].color
        .replace("bg-", "border-")
        .replace("-100", "-300")}
    `}
              style={{
                height: "120px",
                width: "40px",
                borderRadius: "20px / 60px",
              }}
            ></div>

            {/* TOTAL */}
            <p className=" text-[11px] sm:text-sm font-semibold text-blue-500">
              {stages[8].totalLabel}:{" "}
              <span className="font-bold">
                {isLoading ? "..." : totalRecce}
              </span>
            </p>

            {/* INNER CARDS */}
            <div className=" flex justify-center items-center w-full">
              {stages[8].cards.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="bg-white rounded-md border border-gray-200 text-[10px] sm:text-[11px] overflow-hidden"
                >
                  <div className="px-2 py-1 font-semibold bg-blue-500 text-white border-b border-gray-200 truncate">
                    {card.title}
                  </div>
                  <div className="px-2 py-2">
                    {/* header row */}
                    <div className="flex justify-between gap-1 font-semibold mb-1">
                      {card.stats.map((s, idx) => (
                        <span key={idx} className="flex-1 text-center truncate">
                          {s.label}
                        </span>
                      ))}
                    </div>
                    {/* values row */}
                    <div className="flex justify-between gap-1">
                      {card.stats.map((s, idx) => (
                        <span
                          key={idx}
                          className="flex-1 text-center border rounded-sm py-[3px] font-semibold"
                        >
                          {isLoading ? "..." : totalRecce}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecceFunnel;
