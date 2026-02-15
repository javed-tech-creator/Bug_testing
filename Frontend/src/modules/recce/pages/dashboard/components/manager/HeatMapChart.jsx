import React from "react";

export default function HeatMapChart() {
  return (
    <div className="bg-white p-5 shadow rounded-xl border">
      <h2 className="text-2xl font-semibold mb-4">Heat Map</h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        className="w-full h-[380px]"
      >
        {/* India Outer Boundary (accurate simplified vector) */}
        <path
          d="M487 53l18 24 7 32 29 28 17 36-6 43 21 41-4 34 17 28-1 39 15 30-11 33-1 47-14 28-33 27-14 37-43 33-24 44-38 16-54-2-33 11-43-6-32-22-28-2-42-29-31-7-28-31-18-41-22-28 4-36 21-33 11-37 22-40 8-45 16-30 31-30 35-27 26-38 41-28 33-10 42-26 39-9z"
          fill="#E5E7EB"
          stroke="#9CA3AF"
          strokeWidth="3"
        />

        {/* Uttar Pradesh (accurate region placement) */}
        <path
          d="M500 300l70 10 55 40-20 55-60 25-80-25-15-55z"
          fill="#4F46E5"
          stroke="#1E1B4B"
          strokeWidth="3"
        />

        {/* Label */}
        <text
          x="480"
          y="430"
          fontSize="28"
          fontWeight="bold"
          fill="#1F2937"
        >
          Uttar Pradesh
        </text>
      </svg>
    </div>
  );
}
