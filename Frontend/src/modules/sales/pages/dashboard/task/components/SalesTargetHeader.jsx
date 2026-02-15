import React from "react";
import { ArrowLeft, History } from "lucide-react";

const SalesTargetHeader = () => {
  return (
    <div className="w-full bg-gray-100 border-b">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-4 px-4">
        {/* LEFT: BACK + TEXT */}
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button className="p-2 rounded-lg hover:bg-gray-200">
            <ArrowLeft size={26} />
          </button>

          {/* Title + Subtitle */}
          <div>
            <h1 className="text-2xl font-bold">Sales Target Assignment</h1>
            <p className="text-gray-500 text-lg">
              Assign Daily, Weekly and Monthly Targets to Sales Executive.
            </p>
          </div>
        </div>

        {/* RIGHT BUTTON */}
        <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white hover:bg-gray-50">
          <History size={20} />
          <span className="text-gray-700 font-medium">View Target History</span>
        </button>
      </div>
    </div>
  );
};
export default SalesTargetHeader;
