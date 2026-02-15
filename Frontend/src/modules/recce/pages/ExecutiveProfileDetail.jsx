import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  FileText,
  ArrowLeft,
  Download,
  Clock,
  User,
  Heart,
} from "lucide-react";

const ExecutiveProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Get executive data from location state or fetch by ID
  const passedExecutive = location.state?.executive;
const isLoading = false;

  const executive = passedExecutive || fetchedExecutive || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !executive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-4">
            Error loading profile
          </p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    phone,
    photo,
    designationId,
    departmentId,
    workLocation,
    employeeType,
    status,
    joiningDate,
    dob,
    gender,
    bloodGroup,
    qualification,
    maritalStatus,
    currentAddress,
    workEmail,
    emergencyContact,
    documents = [],
    salary = {},
    bankDetail = {},
  } = executive;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Team</span>
          </button>

          <div className="flex gap-8 items-start">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-white shadow-lg">
                {photo?.url ? (
                  <img
                    src={photo.url}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-500">
                      {name?.charAt(0) || "E"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{name}</h1>
              {designationId?.name && (
                <p className="text-xl text-blue-100 mb-4">
                  {designationId.name}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {email && (
                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    <a href={`mailto:${email}`} className="hover:underline">
                      {email}
                    </a>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>{phone}</span>
                  </div>
                )}
                {departmentId?.name && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} />
                    <span>{departmentId.name}</span>
                  </div>
                )}
                {workLocation && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{workLocation}</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-4">
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    status === "Active"
                      ? "bg-green-100 text-green-800"
                      : status === "Inactive"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {status || "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "personal", label: "Personal Info", icon: Heart },
              { id: "employment", label: "Employment", icon: Briefcase },
              { id: "documents", label: "Documents", icon: FileText },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 font-medium flex items-center gap-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TabIcon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                Employment Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Employment Type</p>
                  <p className="font-semibold text-lg">
                    {employeeType || "N/A"}
                  </p>
                </div>
                {joiningDate && (
                  <div>
                    <p className="text-gray-600 text-sm">Joining Date</p>
                    <p className="font-semibold text-lg">
                      {new Date(joiningDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {workEmail && (
                  <div>
                    <p className="text-gray-600 text-sm">Work Email</p>
                    <p className="font-semibold text-lg">{workEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Department & Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-blue-500" />
                Department & Location
              </h3>
              <div className="space-y-4">
                {departmentId?.name && (
                  <div>
                    <p className="text-gray-600 text-sm">Department</p>
                    <p className="font-semibold text-lg">{departmentId.name}</p>
                  </div>
                )}
                {designationId?.name && (
                  <div>
                    <p className="text-gray-600 text-sm">Designation</p>
                    <p className="font-semibold text-lg">
                      {designationId.name}
                    </p>
                  </div>
                )}
                {workLocation && (
                  <div>
                    <p className="text-gray-600 text-sm">Work Location</p>
                    <p className="font-semibold text-lg">{workLocation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Personal Info Tab */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Personal Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Personal Information</h3>
              <div className="space-y-4">
                {dob && (
                  <div>
                    <p className="text-gray-600 text-sm">Date of Birth</p>
                    <p className="font-semibold">
                      {new Date(dob).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {gender && (
                  <div>
                    <p className="text-gray-600 text-sm">Gender</p>
                    <p className="font-semibold">{gender}</p>
                  </div>
                )}
                {bloodGroup && (
                  <div>
                    <p className="text-gray-600 text-sm">Blood Group</p>
                    <p className="font-semibold">{bloodGroup}</p>
                  </div>
                )}
                {maritalStatus && (
                  <div>
                    <p className="text-gray-600 text-sm">Marital Status</p>
                    <p className="font-semibold">{maritalStatus}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address & Emergency Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Address & Emergency</h3>
              <div className="space-y-4">
                {currentAddress && (
                  <div>
                    <p className="text-gray-600 text-sm">Current Address</p>
                    <p className="font-semibold">{currentAddress}</p>
                  </div>
                )}
                {emergencyContact?.name && (
                  <div>
                    <p className="text-gray-600 text-sm">Emergency Contact</p>
                    <p className="font-semibold">{emergencyContact.name}</p>
                    {emergencyContact.relation && (
                      <p className="text-sm text-gray-600">
                        Relation: {emergencyContact.relation}
                      </p>
                    )}
                  </div>
                )}
                {qualification && (
                  <div>
                    <p className="text-gray-600 text-sm">Qualification</p>
                    <p className="font-semibold">{qualification}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Employment Tab */}
        {activeTab === "employment" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salary Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award size={20} className="text-blue-500" />
                Salary Information
              </h3>
              <div className="space-y-4">
                {salary?.ctc ? (
                  <div>
                    <p className="text-gray-600 text-sm">CTC</p>
                    <p className="font-semibold text-lg">
                      ₹{salary.ctc?.toLocaleString()}
                    </p>
                  </div>
                ) : null}
                {salary?.basic ? (
                  <div>
                    <p className="text-gray-600 text-sm">Basic Salary</p>
                    <p className="font-semibold text-lg">
                      ₹{salary.basic?.toLocaleString()}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Bank Information</h3>
              <div className="space-y-4">
                {bankDetail?.bankName && (
                  <div>
                    <p className="text-gray-600 text-sm">Bank Name</p>
                    <p className="font-semibold">{bankDetail.bankName}</p>
                  </div>
                )}
                {bankDetail?.accountNumber && (
                  <div>
                    <p className="text-gray-600 text-sm">Account Number</p>
                    <p className="font-semibold">{bankDetail.accountNumber}</p>
                  </div>
                )}
                {bankDetail?.ifscCode && (
                  <div>
                    <p className="text-gray-600 text-sm">IFSC Code</p>
                    <p className="font-semibold">{bankDetail.ifscCode}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              Documents
            </h3>

            {documents && documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {doc.type || `Document ${index + 1}`}
                      </h4>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Download size={18} />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {doc.url ? "Available for download" : "No file attached"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No documents uploaded
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveProfileDetail;
