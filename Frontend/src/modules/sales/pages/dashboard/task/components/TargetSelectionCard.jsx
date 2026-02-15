import React from "react";
import { ChevronDown } from "lucide-react";

const TargetSelectionCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow border">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-2">
        Choose Executive, Branch And Target Period
      </h2>
      <div className="border-b mb-6"></div>

      {/* GRID 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Select Executive */}
        <div>
          <label className="font-semibold text-gray-700">
            Select Executive
          </label>
          <div className="relative mt-2">
            <select className="w-full bg-gray-100 p-4 pr-10 rounded-xl text-gray-700 appearance-none outline-none">
              <option>Mr. Shivam</option>
              <option>Mr. Ramesh</option>
              <option>Ms. Neha</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Select Branch */}
        <div>
          <label className="font-semibold text-gray-700">Select Branch</label>
          <div className="relative mt-2">
            <select className="w-full bg-gray-100 p-4 pr-10 rounded-xl text-gray-700 appearance-none outline-none">
              <option>Chinhhat</option>
              <option>Gomti Nagar</option>
              <option>Indira Nagar</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Target Type */}
        <div>
          <label className="font-semibold text-gray-700">Target Type</label>
          <div className="relative mt-2">
            <select className="w-full bg-gray-100 p-4 pr-10 rounded-xl text-gray-700 appearance-none outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Select Period */}
        <div>
          <label className="font-semibold text-gray-700">Select Period</label>
          <div className="relative mt-2">
            <input
              type="date"
              className="w-full bg-gray-100 p-4 rounded-xl text-gray-700 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TargetSelectionCard;
