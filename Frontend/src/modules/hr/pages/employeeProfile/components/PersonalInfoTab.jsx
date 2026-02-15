export default function PersonalInfoTab({ employee }) {
   
  const renderValue = (val) => {
    if (!val) return "N/A";
    if (typeof val === "object") {
 
      return val.name || val.email || JSON.stringify(val);
    }
    return val;
  };

  return (
    <div className="space-y-6">
      {/* Basic & Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Basic & Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Candidate ID</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.candidateId)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.name)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.email)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Work Email</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.workEmail)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.phone)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Alternate Number</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.alternateNo)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">WhatsApp</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.whatsapp)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-gray-900 font-medium">
              {employee?.dob
                ? new Date(employee.dob).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {renderValue(employee?.gender)}
            </span>
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Joining Date</p>
            <p className="text-gray-900 font-medium">
              {employee?.joiningDate
                ? new Date(employee.joiningDate).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Employee Type</p>
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              {renderValue(employee?.employeeType)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Work Location</p>
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
              {renderValue(employee?.workLocation)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Qualification</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.qualification)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Marital Status</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.maritalStatus)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Blood Group</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.bloodGroup)}</p>
          </div>
        </div>
      </div>

      {/* Identification Details */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Aadhar Number</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.aadhar)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">PAN Number</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.pan)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Passport Number</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.passport)}</p>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Contact Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.emergencyContact?.name)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Relationship</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.emergencyContact?.relation)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.emergencyContact?.phone)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
