import React from "react";
import PaymentBadge from "./PaymentBadge";

const payments = [
  { id: "01", name: "Home Decor Range", percent: 45, color: "#4A7DFF" },
  {
    id: "02",
    name: "Disney Princess Pink Bag 18'",
    percent: 29,
    color: "#28C96F",
  },
  { id: "03", name: "Bathroom Essentials", percent: 18, color: "#8A4BFF" },
  { id: "04", name: "Apple Smartwatches", percent: 25, color: "#FF8A34" },
];

const PartialPayments = () => {
  return (
    <div className="w-full lg:w-full p-6 rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Partial / Pending Payments</h2>
        <button className="text-blue-600 font-medium cursor-pointer">
          View All
        </button>
      </div>

      {/* Table Header */}
      <div className="flex items-center justify-between text-base text-gray-700 border-b pb-2 gap-4">
        <span className="w-10">#</span>
        <span className="flex-1 text-left">Name</span>
        <span className="text-right">Payment</span>
      </div>

      {/* Rows */}
      <div className="mt-2 divide-y">
        {payments.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-4 text-gray-700 gap-4"
          >
            <span className="w-10">{item.id}</span>
            <span className="flex-1 truncate">{item.name}</span>
            <PaymentBadge percent={item.percent} color={item.color} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartialPayments;
