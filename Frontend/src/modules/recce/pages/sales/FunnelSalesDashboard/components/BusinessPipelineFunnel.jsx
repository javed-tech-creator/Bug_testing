import React from "react";

// BUCKET CYLINDER COMPONENT
const BucketCylinder = ({
  label,
  value,
  width = 100,
  height = 200,
  showLeadTypes = false,
  hotLeads = 0,
  coldLeads = 0,
  warmLeads = 0,
}) => (
  <div className="flex flex-col items-center mt-4">
    {/* Top Ellipse */}
    <svg width={width} height="10" className="relative z-10">
      <ellipse
        cx={width / 2}
        cy="5"
        rx={width / 2 - 2}
        ry="5"
        fill="#FEF3C7"
        stroke="#F59E0B"
        strokeWidth="2"
      />
    </svg>
    {/* Cylinder Body */}
    <div
      className="bg-gradient-to-b from-yellow-50 via-orange-50 to-yellow-100 shadow-xl relative border-r-2 border-orange-400 flex items-center justify-center"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        marginTop: "0px",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-2 h-full">
        <div
          className="bg-red-600 text-white px-2 py-1 rounded-full text-center shadow-md text-sm font-bold"
          style={{ fontSize: `clamp(10px, ${height * 0.045}px, 16px)` }}
        >
          Hot Lead: {hotLeads}
        </div>
        <div
          className="bg-blue-500 text-white px-2 py-1 rounded-full text-center shadow-md text-sm font-bold"
          style={{ fontSize: `clamp(10px, ${height * 0.045}px, 16px)` }}
        >
          Cold Lead: {coldLeads}
        </div>
        <div
          className="bg-orange-500 text-white px-2 py-1 rounded-full text-center shadow-md text-sm font-bold"
          style={{ fontSize: `clamp(10px, ${height * 0.045}px, 16px)` }}
        >
          Warm Lead: {warmLeads}
        </div>
      </div>
    </div>
    {/* Bottom Ellipse */}
    <svg
      width={width}
      height="10"
      className="relative"
      style={{ marginTop: "0px" }}
    >
      <ellipse
        cx={width / 2}
        cy="5"
        rx={width / 2 - 2}
        ry="5"
        fill="#FEF3C7"
        stroke="#F59E0B"
        strokeWidth="1"
      />
    </svg>
  </div>
);

// PIPELINE STAGE CARD COMPONENT (HORIZONTAL CYLINDER)
const PipelineStageCard = ({
  title,
  index,
  totalLeads,
  tableData,
  droppedLeads,
  satisfactionLevel = "High",
  badgeColor = "#7C3AED",
  height = 280,
  bucketData = { hotLeads: 0, coldLeads: 0, warmLeads: 0 },
}) => {
  const tags = [
    { label: "Hot", color: "bg-red-600" },
    { label: "Warm", color: "bg-orange-500" },
    { label: "Cold", color: "bg-green-700" },
    { label: "Sat: High", color: "bg-blue-700" },
    { label: "Sat: Low", color: "bg-gray-600" },
    { label: "Rev: High", color: "bg-orange-600" },
    { label: "Rev: Low", color: "bg-gray-700" },
    { label: "Repeat: High", color: "bg-teal-700" },
    { label: "Repeat: Low", color: "bg-gray-600" },
    { label: "Engage: High", color: "bg-purple-700" },
    { label: "Engage: Low", color: "bg-gray-700" },
    { label: "Feed: High", color: "bg-blue-800" },
  ];

  const cylinderLength =
    index === 0
      ? 1000 // Stage 1 - Largest
      : index >= 1 && index <= 4
      ? 700 // Stage 2-5 - Same size, smaller than 1
      : index === 5
      ? 600 // Stage 6 - Smaller than 2-5, bigger than 7
      : 500; // Stage 7 - Smallest

  const cylinderHeight =
    index === 0
      ? 350 // Stage 1 - Largest height
      : index >= 1 && index <= 4
      ? 320 // Stage 2-5 - Same height, smaller than 1
      : index === 5
      ? 300 // Stage 6 - Smaller than 2-5, bigger than 7
      : 280; // Stage 7 - Smallest height

  const scaleFactor = index === 0 ? 1.2 : index === 6 ? 0.85 : 1;

  return (
    <div
      className="flex flex-col items-center mb-6"
      style={{ minWidth: "300px" }}
    >
      {/* Stage Title Badge */}
      <div className="flex justify-center mb-3">
        <div
          className="text-white px-4 py-1 rounded-md font-semibold text-xs shadow-md"
          style={{ backgroundColor: badgeColor }}
        >
          {title}
        </div>
      </div>

      {/* Horizontal Cylinder Card Container */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex flex-row items-center justify-center">
          {/* Left Ellipse (Front face) */}
          <svg width="12" height={cylinderHeight} className="relative z-10">
            <ellipse
              cx="6"
              cy={cylinderHeight / 2}
              rx="6"
              ry={cylinderHeight / 2 - 2}
              fill="#E0E7FF"
              stroke={index === 0 ? "#6366F1" : "none"}
              strokeWidth={index === 0 ? 2 : 0}
            />
          </svg>

          {/* Cylinder Body (Horizontal) */}
          <div
            className="bg-gradient-to-r from-indigo-100 via-purple-50 to-blue-100 shadow-2xl flex flex-col px-3 py-2 relative border-t-2 border-b-2 border-indigo-400"
            style={{
              width: `${cylinderLength}px`,
              height: `${cylinderHeight}px`,
              marginLeft: "-12px",
              marginRight: "-12px",
            }}
          >
            <div className="text-center mb-2 flex-none">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-md inline-block">
                <span
                  className="text-sm font-bold"
                  style={{
                    fontSize: `clamp(12px, ${
                      cylinderHeight * 0.06 * scaleFactor
                    }px, 20px)`,
                  }}
                >
                  Total Leads: {totalLeads}
                </span>
              </div>
            </div>

            {/* Tags Section */}
            <div className="flex flex-wrap justify-center gap-1 mb-2 flex-none">
              {tags.slice(0, 12).map((tag, idx) => (
                <span
                  key={idx}
                  className={`${tag.color} text-white text-[10px] font-medium px-1.5 py-0.5 rounded text-center`}
                  style={{
                    fontSize: `clamp(9px, ${
                      cylinderHeight * 0.05 * scaleFactor
                    }px, 14px)`,
                  }}
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Data Table */}
            <table className="w-full border border-gray-300 text-center bg-white">
              <thead>
                <tr className="bg-[#1E3A8A] text-white text-sm font-bold">
                  <th className="py-2 border-r border-gray-300">Total Leads</th>
                  <th className="py-2 border-r border-gray-300">
                    Expected Value (₹)
                  </th>
                  <th className="py-2" colSpan="4">
                    Expected Incentives (₹)
                  </th>
                </tr>
                <tr className="bg-gray-900 text-white text-xs">
                  <th className="py-2 border-r border-gray-700"></th>
                  <th className="py-2 border-r border-gray-700"></th>
                  <th className="py-2 border-r border-gray-700">Lead</th>
                  <th className="py-2 border-r border-gray-700">Deal</th>
                  <th className="py-2 border-r border-gray-700">
                    Relationship
                  </th>
                  <th className="py-2">Total Incentives</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-black font-semibold text-sm">
                  <td className="py-3 border border-gray-300 text-blue-600">
                    {totalLeads}
                  </td>
                  <td className="py-3 border border-gray-300">
                    {tableData.expectedValue}L
                  </td>
                  <td className="py-3 border border-gray-300">
                    ₹{tableData.lead.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 border border-gray-300">
                    ₹{tableData.deal.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 border border-gray-300">
                    ₹{tableData.relationship.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 border border-gray-300 text-blue-600 font-bold">
                    ₹
                    {(
                      tableData.lead +
                      tableData.deal +
                      tableData.relationship
                    ).toLocaleString("en-IN")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Ellipse (Back face) */}
          <svg width="12" height={cylinderHeight} className="relative">
            <ellipse
              cx="6"
              cy={cylinderHeight / 2}
              rx="6"
              ry={cylinderHeight / 2 - 2}
              fill="#E0E7FF"
              stroke="#6366F1"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Dropped Bucket below each card */}
      <BucketCylinder
        label="Dropped"
        value={droppedLeads}
        width={140}
        height={190}
        showLeadTypes={true}
        hotLeads={bucketData.hotLeads}
        coldLeads={bucketData.coldLeads}
        warmLeads={bucketData.warmLeads}
      />
    </div>
  );
};

const BusinessPipelineFunnel = () => {
  const ROW_LEADS = 900;
  const NOT_INTERESTED_LEADS = 750;

  // Main bucket data
  const mainBucketData = {
    hotLeads: 750,
    coldLeads: 750,
    warmLeads: 750,
  };

  // Badge colors
  const getBadgeColor = (index) => {
    const colors = [
      "#9333EA",
      "#DC2626",
      "#F97316",
      "#EA580C",
      "#F59E0B",
      "#10B981",
      "#3B82F6",
    ];
    return colors[index] || "#7C3AED";
  };

  const pipelineStages = [
    {
      id: 1,
      key: "lead-management",
      title: "Lead Management",
      totalLeads: 800,
      valueMultiplier: 0.0118,
      leadIncentive: 10000,
      dealIncentive: 10000,
      relationshipIncentive: 10000,
      droppedLeads: 50,
      satisfactionLevel: "High",
      bucketData: { hotLeads: 20, coldLeads: 15, warmLeads: 15 },
      tableData: {
        expectedValue: 9.4,
        lead: 10000,
        deal: 10000,
        relationship: 10000,
      },
    },
    {
      id: 2,
      key: "recce",
      title: "Pre-Sales Management",
      totalLeads: 750,
      valueMultiplier: 0.0115,
      leadIncentive: 9500,
      dealIncentive: 9500,
      relationshipIncentive: 9500,
      droppedLeads: 100,
      satisfactionLevel: "High",
      bucketData: { hotLeads: 40, coldLeads: 30, warmLeads: 30 },
      tableData: {
        expectedValue: 8.6,
        lead: 9500,
        deal: 9500,
        relationship: 9500,
      },
    },
    {
      id: 3,
      key: "design",
      title: "Pre-Sales Management",
      totalLeads: 650,
      valueMultiplier: 0.0112,
      leadIncentive: 9000,
      dealIncentive: 9000,
      relationshipIncentive: 9000,
      droppedLeads: 100,
      satisfactionLevel: "Medium",
      bucketData: { hotLeads: 35, coldLeads: 35, warmLeads: 30 },
      tableData: {
        expectedValue: 7.3,
        lead: 9000,
        deal: 9000,
        relationship: 9000,
      },
    },
    {
      id: 4,
      key: "quotation",
      title: "Pre-Sales Management",
      totalLeads: 550,
      valueMultiplier: 0.0105,
      leadIncentive: 8500,
      dealIncentive: 8500,
      relationshipIncentive: 8500,
      droppedLeads: 100,
      satisfactionLevel: "Medium",
      bucketData: { hotLeads: 40, coldLeads: 30, warmLeads: 30 },
      tableData: {
        expectedValue: 5.8,
        lead: 8500,
        deal: 8500,
        relationship: 8500,
      },
    },
    {
      id: 5,
      key: "combined-pre-sales",
      title: "Combined Pre-Sales",
      totalLeads: 450,
      valueMultiplier: 0.0102,
      leadIncentive: 8000,
      dealIncentive: 8000,
      relationshipIncentive: 8000,
      droppedLeads: 100,
      satisfactionLevel: "Medium",
      bucketData: { hotLeads: 35, coldLeads: 35, warmLeads: 30 },
      tableData: {
        expectedValue: 4.6,
        lead: 8000,
        deal: 8000,
        relationship: 8000,
      },
    },
    {
      id: 6,
      key: "deal-management",
      title: "Deal Management",
      totalLeads: 350,
      valueMultiplier: 0.0102,
      leadIncentive: 12000,
      dealIncentive: 12000,
      relationshipIncentive: 12000,
      droppedLeads: 100,
      satisfactionLevel: "High",
      bucketData: { hotLeads: 40, coldLeads: 30, warmLeads: 30 },
      tableData: {
        expectedValue: 3.6,
        lead: 12000,
        deal: 12000,
        relationship: 12000,
      },
    },
    {
      id: 7,
      key: "pendency",
      title: "Pendency",
      totalLeads: 250,
      valueMultiplier: 0.0102,
      leadIncentive: 7000,
      dealIncentive: 7000,
      relationshipIncentive: 7000,
      droppedLeads: 100,
      satisfactionLevel: "Low",
      bucketData: { hotLeads: 35, coldLeads: 35, warmLeads: 30 },
      tableData: {
        expectedValue: 2.6,
        lead: 7000,
        deal: 7000,
        relationship: 7000,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-6 overflow-x-auto">
      {/* Funnel Main Row (Responsive Wrap) */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-row items-start gap-1 flex-nowrap">
          {/* LEFT: Raw Leads & Not Interested Bucket */}
          <div className="flex flex-col items-center pr-2">
            <span className="text-xs font-bold text-gray-900 mb-2 bg-purple-200 px-3 py-1 rounded-md">
              Raw Leads
            </span>
            {/* Assigned Leads Block */}
            <div
              className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-xl flex flex-col items-center justify-between py-6 px-3 border-2 border-purple-900"
              style={{ width: "90px", height: "230px" }}
            >
              <span className="text-white text-3xl font-bold mt-2">
                {ROW_LEADS}
              </span>
              <span
                className="text-purple-100 text-[10px] font-bold tracking-[0.13em] select-none"
                style={{
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                }}
              >
                ASSIGNED LEADS
              </span>
            </div>
            <BucketCylinder
              label="Not Interested"
              value={NOT_INTERESTED_LEADS}
              width={100}
              height={200}
              showLeadTypes={true}
              hotLeads={mainBucketData.hotLeads}
              coldLeads={mainBucketData.coldLeads}
              warmLeads={mainBucketData.warmLeads}
            />
          </div>
          {/* MIDDLE: Interested Arrow Indicator */}
          <div className="flex flex-col items-center px-2">
            <span className="text-xs font-bold text-gray-900 mt-2 mb-2 bg-green-200 px-3 py-1 rounded-md">
              Interested
            </span>
            {/* Arrows */}
            <div className="flex flex-col gap-1 items-center mt-1">
              {Array.from({ length: 7 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-green-600 text-sm font-bold">₹</span>
                  <svg width="32" height="12" className="overflow-visible">
                    <line
                      x1="0"
                      y1="6"
                      x2="23"
                      y2="6"
                      stroke="#059669"
                      strokeWidth="2"
                    />
                    <polygon points="23,3 32,6 23,9" fill="#059669" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          {/* RIGHT: Pipeline Stages (Cards + Buckets in col) */}
          <div className="flex items-start flex-nowrap">
            {pipelineStages.map((stage, idx) => (
              <PipelineStageCard
                key={stage.key}
                index={idx}
                title={stage.title}
                totalLeads={stage.totalLeads}
                tableData={stage.tableData}
                droppedLeads={stage.droppedLeads}
                satisfactionLevel={stage.satisfactionLevel}
                badgeColor={getBadgeColor(idx)}
                bucketData={stage.bucketData}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPipelineFunnel;
