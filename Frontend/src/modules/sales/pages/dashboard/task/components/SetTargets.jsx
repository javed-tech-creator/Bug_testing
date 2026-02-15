import React from "react";

const SetTargets = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-4">Set Targets</h2>
      <div className="border-b mb-8"></div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lead Generation Target */}
        <div>
          <label className="font-medium text-gray-700">
            Lead Generation Target
          </label>
          <input
            type="number"
            placeholder="Enter number of leads"
            className="w-full bg-gray-100 p-4 rounded-xl mt-2 outline-none"
          />
        </div>

        {/* Client Meeting Target */}
        <div>
          <label className="font-medium text-gray-700">
            Client Meeting Target
          </label>
          <input
            type="number"
            placeholder="Enter number of client meetings"
            className="w-full bg-gray-100 p-4 rounded-xl mt-2 outline-none"
          />
        </div>

        {/* Client Conversion Target */}
        <div>
          <label className="font-medium text-gray-700">
            Client Conversion Target
          </label>
          <input
            type="number"
            placeholder="Enter number of conversions"
            className="w-full bg-gray-100 p-4 rounded-xl mt-2 outline-none"
          />
        </div>

        {/* Revenue Target */}
        <div>
          <label className="font-medium text-gray-700">Revenue Target</label>
          <input
            type="number"
            placeholder="Enter target amount in ₹"
            className="w-full bg-gray-100 p-4 rounded-xl mt-2 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default SetTargets;
