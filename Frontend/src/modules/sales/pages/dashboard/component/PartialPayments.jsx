import React, { useState } from "react";
import PaymentBadge from "./PaymentBadge";
import { useGetPendingClientPaymentsQuery } from "@/api/sales/dashboard.sales.api.js";

const STATUS_OPTIONS = [
  { label: "Pending", value: "PENDING" },
  { label: "Initial Done", value: "INITIAL_DONE" },
  { label: "Paid", value: "PAID" },
];

const getColorByPercent = (percent) => {
  if (percent >= 40) return "#4A7DFF";
  if (percent >= 25) return "#FF8A34";
  if (percent >= 10) return "#8A4BFF";
  return "#28C96F";
};

const PartialPayments = () => {
  const [status, setStatus] = useState("PENDING");

  const { data, isLoading } = useGetPendingClientPaymentsQuery({
    status,
  });

  if (isLoading) return null;

  const list = data?.data || [];

  return (
    <div className="w-full p-4 h-full rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Client Payments
        </h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-orange-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table Header */}
      <div className="flex items-center text-sm text-gray-600 border-b pb-2 gap-4">
        <span className="w-8">#</span>
        <span className="flex-1">Client</span>
        <span className="flex-1">Project</span>
        <span className="w-28 text-right">Amount</span>
        <span className="w-24 text-right">Status</span>
      </div>

      {/* Rows */}
      <div className="mt-2 divide-y max-h-[320px] overflow-y-auto pr-1">
        {list.map((item, index) => (
          <div
            key={`${item.clientId}-${item.projectId}`}
            className="flex items-center py-3 text-gray-700 gap-4"
          >
            <span className="w-8">
              {(index + 1).toString().padStart(2, "0")}
            </span>

            <span className="flex-1 truncate">
              {item.clientName}
            </span>

            <span className="flex-1 truncate text-gray-500">
              {item.projectName || "-"}
            </span>

            <span className="w-28 text-right font-medium">
              ₹{item.displayAmount?.toLocaleString("en-IN")}
            </span>

            <div className="w-24 text-right">
              <PaymentBadge
                percent={item.remainingPercentage || 0}
                color={getColorByPercent(item.remainingPercentage || 0)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartialPayments;
