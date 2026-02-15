import React from "react";

function AddressTab({ employee }) {
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
        <h3 className="text-lg font-semibold mb-4">Address Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current </p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.currentAddress)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Permanent</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.permanentAddress)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.cityId?.title)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.stateId?.title)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.country)}</p>
          </div>
         
        </div>
      </div>
   </>
  );
}

export default AddressTab;
