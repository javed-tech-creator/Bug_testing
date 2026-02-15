import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const statusStyles = {
  Excellent: "bg-green-100 text-green-600",
  Good: "bg-blue-100 text-blue-600",
  Bad: "bg-red-100 text-red-600",
};

export default function TeamPerformancePanel() {
  const [timeFilter, setTimeFilter] = useState("This Week");

  const dataSet = {
    "This Week": [
      {
        date: "09-08-2024",
        name: "Hemanth Raghava",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        recce: 22,
        status: "Excellent",
        approval: "91%",
      },
      {
        date: "02-08-2024",
        name: "Angel Arna",
        img: "https://randomuser.me/api/portraits/women/45.jpg",
        recce: 15,
        status: "Good",
        approval: "95%",
      },
      {
        date: "01-08-2024",
        name: "Ravi Kumar",
        img: "https://randomuser.me/api/portraits/men/55.jpg",
        recce: 18,
        status: "Good",
        approval: "88%",
      },
      {
        date: "30-07-2024",
        name: "Sneha Verma",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
        recce: 12,
        status: "Excellent",
        approval: "94%",
      },
    ],
    "This Month": [
      {
        date: "10-07-2024",
        name: "Peter",
        img: "https://randomuser.me/api/portraits/men/12.jpg",
        recce: 30,
        status: "Good",
        approval: "87%",
      },
      {
        date: "05-07-2024",
        name: "Rohit Singh",
        img: "https://randomuser.me/api/portraits/men/77.jpg",
        recce: 50,
        status: "Bad",
        approval: "60%",
      },
      {
        date: "20-07-2024",
        name: "Amit Patel",
        img: "https://randomuser.me/api/portraits/men/41.jpg",
        recce: 42,
        status: "Good",
        approval: "83%",
      },
      {
        date: "15-07-2024",
        name: "Neha Sharma",
        img: "https://randomuser.me/api/portraits/women/28.jpg",
        recce: 36,
        status: "Bad",
        approval: "68%",
      },
    ],
    "This Year": [
      {
        date: "12-04-2024",
        name: "Hemanth Raghava",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
        recce: 120,
        status: "Excellent",
        approval: "92%",
      },
      {
        date: "11-03-2024",
        name: "Angel Arna",
        img: "https://randomuser.me/api/portraits/women/45.jpg",
        recce: 85,
        status: "Good",
        approval: "89%",
      },
      {
        date: "18-02-2024",
        name: "Suresh Iyer",
        img: "https://randomuser.me/api/portraits/men/90.jpg",
        recce: 200,
        status: "Excellent",
        approval: "96%",
      },
      {
        date: "05-01-2024",
        name: "Pooja Nair",
        img: "https://randomuser.me/api/portraits/women/12.jpg",
        recce: 150,
        status: "Good",
        approval: "90%",
      },
    ],
  };

  const selectedData = dataSet[timeFilter];

  return (
    <div className="bg-white p-5 shadow rounded-xl border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Team Performance Panel</h2>

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="flex items-center gap-2 text-gray-600 border px-3 py-1 rounded-lg text-sm cursor-pointer bg-white"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-gray-500 text-sm">
            <th className="pb-3">Date</th>
            <th className="pb-3">Executive Name</th>
            <th className="pb-3">Recce Assigned</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Approval %</th>
          </tr>
        </thead>

        <tbody>
          {selectedData.map((row, i) => (
            <tr key={i} className="border-b py-6">
              <td className="py-4">{row.date}</td>

              {/* executive + image */}
              <td className="py-4 flex items-center gap-3">
                <img
                  src={row.img}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{row.name}</span>
              </td>

              <td className="py-4">{row.recce}</td>

              {/* Status Badge */}
              <td className="py-4">
                <span
                  className={`px-4 py-1 rounded-full text-sm ${
                    statusStyles[row.status]
                  }`}
                >
                  {row.status}
                </span>
              </td>

              <td className="py-4 font-semibold">{row.approval}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
