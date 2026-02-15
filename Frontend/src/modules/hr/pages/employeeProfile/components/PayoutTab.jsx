import React from "react";

function PayoutTab({ employee }) {
    const renderValue = (val) => {
    if (!val) return "N/A";
    if (typeof val === "object") {
      return val.name || val.email || JSON.stringify(val);
    }
    return val;
  };
  return (
   <>
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Payout Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Probation Period </p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.probationPeriod)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CTC *</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.slaary?.ctc)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Basic *</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.salary?.basic)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">HRA</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.salary?.hra)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Allowances</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.salary?.allowances)}</p>
          </div>
           <div>
            <p className="text-sm text-gray-500">Deductions</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.salary?.deductions)}</p>
          </div>
           <div>
            <p className="text-sm text-gray-500">PF Account No</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.pfAccountNo)}</p>
          </div>
           <div>
            <p className="text-sm text-gray-500">UAN</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.uan)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">ESIC No</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.esicNo)}</p>
          </div>
         
        </div>
      </div>
   </>
  );
}

export default PayoutTab;
