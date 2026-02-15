import React from "react";

const PaymentBadge = ({ percent, color }) => {
  return (
    <span
      className="px-3 py-1 rounded-xl text-base font-medium border text-gray-700"
      style={{
        color: color,
        borderColor: color,
      }}
    >
      {percent}%
    </span>
  );
};

export default PaymentBadge;
