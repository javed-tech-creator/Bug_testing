// components/common/DataLoading.jsx
import React from "react";
import { FaSpinner } from "react-icons/fa";

const DataLoading = ({ text = "Loading..." }) => (
  <div className="flex justify-center items-center gap-2 py-6 text-gray-600">
    <FaSpinner className="animate-spin w-5 h-5 text-orange-500" />
    <span>{text}</span>
  </div>
);

export default DataLoading;
