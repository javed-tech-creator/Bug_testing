import React from "react";
import { Info } from "lucide-react"; // Optional icon

const StatusSummaryCards = ({ orders=[] }) => {

  const calculateTotals=(orders)=> {
 const totals = orders.reduce(
    (acc, order) => {
      const grandTotal = Number(order.grandTotal) || 0;
      const amountPaid = Number(order.amountPaid) || 0;

      acc.total += grandTotal;

      if (order.paymentStatus === "Paid") {
        acc.paid += amountPaid; // fully paid
      } else if (order.paymentStatus === "Pending") {
        acc.pending += grandTotal - amountPaid; // nothing or little paid
      } else if (order.paymentStatus === "Partial") {
        acc.paid += amountPaid;
        acc.pending += grandTotal - amountPaid;
      }

      return acc;
    },
    { total: 0, paid: 0, pending: 0 }
  );

  return totals;
}

const { total, paid, pending } = calculateTotals(orders);

  const cardData = [
    {
      label: "Total",
      value: total,
      bg: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      label: "Paid",
      value: paid,
      bg: "bg-green-50",
      textColor: "text-green-800",
    
    },
    {
      label: "Pending",
      value: pending,
      bg: "bg-orange-50",
      textColor: "text-orange-800",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 ">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className={`flex items-center px-4 py-2 rounded-xl ${card.bg}`}
        >
          <span className="text-sm mr-2">{card.label}</span>
          <span className={`font-bold ${card.textColor} text-base`}>
            ₹ {card.value?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          {card.icon && card.icon}
        </div>
      ))}
    </div>
  );
};

export default StatusSummaryCards;
