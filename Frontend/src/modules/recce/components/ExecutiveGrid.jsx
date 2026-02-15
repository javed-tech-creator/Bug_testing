import React from "react";
import ExecutiveCard from "./ExecutiveCard";
import { Loader } from "lucide-react";

const ExecutiveGrid = ({ executives, loading, error, onCardClick }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader
            className="animate-spin mx-auto mb-4 text-blue-500"
            size={32}
          />
          <p className="text-gray-600">Loading executives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="mb-2">Error loading executives</p>
          <p className="text-sm text-gray-600">
            {error?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (!executives || executives.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-gray-500">
          <p className="text-xl font-semibold mb-2">No Executives Found</p>
          <p className="text-sm">There are no active executives to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {executives.map((executive) => (
        <ExecutiveCard
          key={executive._id}
          executive={executive}
          onClick={() => onCardClick(executive)}
        />
      ))}
    </div>
  );
};

export default ExecutiveGrid;
