import React from "react";

function BankSalaryTab({ employee }) {
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
        <h3 className="text-lg font-semibold mb-4">Bank & Salary Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Holder Name </p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.bankDetail?.accountHolderName)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bank Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.bankDetail?.bankName)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Branck Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.bankDetail?.branchName)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.bankDetail?.accountNumber)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">IFSC Code</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.bankDetail?.ifscCode)}</p>
          </div>
         
        </div>
      </div>
   </>
  );
}

export default BankSalaryTab;
