import React from "react";
import StatusBadge from "./StatusBadge";

const TopPerformerRow = ({ date, img, name, email, status, revenue }) => {
  return (
    <tr className="border-b text-base text-gray-700">
      <td className="py-4 min-w-[90px] md:table-cell hidden md:table-cell">{date}</td>

      <td className="py-4 min-w-[160px] md:table-cell hidden md:table-cell">
        <div className="flex items-center gap-3">
          <img
            src={img}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium text-base text-gray-800">{name}</span>
        </div>
      </td>

      <td className="py-4 text-gray-700 whitespace-nowrap text-base min-w-[200px] md:table-cell hidden md:table-cell">{email}</td>

      <td className="py-4 whitespace-nowrap min-w-[110px] md:table-cell hidden md:table-cell">
        <StatusBadge status={status} />
      </td>

      <td className="py-4 font-semibold text-base text-gray-800 whitespace-nowrap min-w-[110px] md:table-cell hidden md:table-cell">{revenue}</td>
    </tr>
  );
};

export default TopPerformerRow;
