import React from "react";
import { ChevronDown, Plus } from "lucide-react";

const ProductWiseTargets = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Product-wise Targets</h2>
      <div className="border-b mb-8"></div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product Name */}
        <div>
          <label className="font-medium text-gray-700">Product Name</label>
          <div className="relative mt-2">
            <select className="w-full bg-gray-100 p-4 pr-10 rounded-xl text-gray-700 appearance-none outline-none">
              <option>Select product</option>
              <option>Product A</option>
              <option>Product B</option>
              <option>Product C</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Target Quantity */}
        <div>
          <label className="font-medium text-gray-700">Target Quantity</label>
          <input
            type="number"
            placeholder="Enter target quantity"
            className="w-full bg-gray-100 p-4 rounded-xl mt-2 outline-none"
          />
        </div>

        {/* Expected Revenue */}
        <div>
          <label className="font-medium text-gray-700">
            Expected Revenue
          </label>
          <input
            type="number"
            placeholder="Enter expected revenue"
            className="w-full bg-gray-100 p-4 rounded-xl mt-2 outline-none"
          />
        </div>
      </div>

      {/* Add Product Button */}
      <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 mt-6 rounded-xl hover:bg-blue-50 transition">
        <Plus size={18} />
        Add Product
      </button>
    </div>
  );
};

export default ProductWiseTargets;
