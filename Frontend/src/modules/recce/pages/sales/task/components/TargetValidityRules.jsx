import React from "react";

const TargetValidityRules = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">Target Validity & Rules</h2>
      <div className="border-b mb-8"></div>

      {/* Rules Box */}
      <div className="bg-gray-100 p-6 rounded-xl">
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-base">
          <li>Target is mandatory</li>
          <li>No carry forward allowed</li>
          <li>Target linked with incentives</li>
          <li>Approval required after submission</li>
        </ul>
      </div>
    </div>
  );
};

export default TargetValidityRules;
