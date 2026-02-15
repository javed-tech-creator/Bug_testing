import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Building2,
  User,
  MapPin,
  CreditCard,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DynamicProfileView = ({ title, id, fetchById }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const [triggerFetch, { data, isLoading, isFetching, isError }] = fetchById;

  React.useEffect(() => {
    if (id) triggerFetch(id);
  }, [id]);

  const apiResponse = data?.data;
  const [downloadingFile, setDownloadingFile] = useState(null);

  const handleDownload = async (fileUrl, fileName) => {
    if (!fileUrl) return alert("No file found.");
    setDownloadingFile(fileName);
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error downloading file");
    }
    setDownloadingFile(null);
  };

  if (isFetching || isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-base font-semibold text-gray-700 animate-pulse">
            Loading profile details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-gray-600">Unable to fetch {title} data</p>
        </div>
      </div>
    );
  }

  if (!apiResponse) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600">No data found for this {title}</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: "Business & Personal Details",
      fields: [
        { label: "Contact Person Name", value: apiResponse?.contactPersonName },
        { label: "Business Name", value: apiResponse?.businessName },
        { label: "Email", value: apiResponse?.email },
        { label: "Contact Number", value: apiResponse?.contactNumber },
        { label: "Alternate Contact", value: apiResponse?.alternateContact },
      ],
    },
    {
      title: "Business Address",
      fields: [
        {
          label: "Address",
          value: apiResponse?.address,
        },
        { label: "City", value: apiResponse?.city },
        { label: "State", value: apiResponse?.state },
        { label: "Pincode", value: apiResponse?.pincode },
      ],
    },
    {
      title: "KYC Details",
      fields: [
        { label: "GST Number", value: apiResponse?.gstNumber },
        { label: "PAN Number", value: apiResponse?.panNumber },
        { label: "Aadhar Number", value: apiResponse?.aadharNumber },
        { label: "Bank Name", value: apiResponse?.bankName },
        { label: "Account Number", value: apiResponse?.accountNumber },
        { label: "IFSC Code", value: apiResponse?.ifscCode },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-md shadow-lg   border border-gray-200 p-2 sm:p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center ">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {title}
                </h2>
                {/* <p className="text-sm text-gray-500">Complete vendor information</p> */}
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-sm font-semibold rounded-md  cursor-pointer transition-all duration-200"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6  items-stretch">
          {/* Profile Card */}
          <div className="lg:col-span-1 h-full">
            <div className="bg-white h-full rounded-md shadow-lg  border border-gray-200 p-6  transition-all duration-300">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-orange-400 to-orange-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
                  <img
                    src={
                      apiResponse.profileImage?.public_url ||
                      apiResponse.profileImage?.url ||
                      "https://i.pravatar.cc/100?img=13"
                    }
                    alt="Profile"
                    className="relative w-32 h-32 rounded-full border-4 border-white  object-cover ring-4 ring-orange-100"
                  />
                </div>
                <div className="text-center space-y-3 w-full">
                  <div>
                    <p className="text-xl font-bold text-gray-800 mb-1">
                      {apiResponse?.contactPersonName || "—"}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <p className="text-sm font-medium">
                        {apiResponse?.city || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Business
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {apiResponse?.businessName || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Address Card */}
          <div className="lg:col-span-3 h-full">
            <div className="bg-white rounded-md shadow-lg   border border-gray-200 p-6  transition-all duration-300 h-full">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
                <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center ">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Business Address
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sections[1].fields.map((f) => (
                  <InfoCard key={f.label} label={f.label} value={f.value} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Business & Personal Details */}
        <div className="bg-white rounded-md shadow-lg  border border-gray-200 p-6  transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-orange-600 rounded-xl flex items-center justify-center ">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">
              Business & Personal Details
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections[0].fields.map((f) => (
              <InfoCard key={f.label} label={f.label} value={f.value} />
            ))}
          </div>
        </div>

        {/* KYC Details */}
        <div className="bg-white rounded-md shadow-lg  border border-gray-200 p-6  transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center ">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">KYC Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections[2].fields.map((f) => (
              <InfoCard key={f.label} label={f.label} value={f.value} />
            ))}
          </div>
        </div>

        {/* Contract Form */}
        <div className="bg-white rounded-md shadow-lg  border border-gray-200 p-6  transition-all duration-300">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center ">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Contract Form</h3>
          </div>
          <div className="flex items-center justify-between bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-800 font-medium">
                {apiResponse.contractForm?.fileName || "No file uploaded"}
              </p>
            </div>

            {apiResponse.contractForm?.public_url ||
            apiResponse.contractForm?.url ? (
              <div className="flex gap-3">
                <a
                  href={
                    apiResponse.contractForm?.public_url ||
                    apiResponse.contractForm?.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                     title="View Document"
                  className="flex items-center justify-center w-8 h-8  bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-sm transition-all duration-200  "
                >
                  <Eye size={16} /> 
                </a>
                <button
                  onClick={() =>
                    handleDownload(
                      apiResponse.contractForm?.public_url ||
                        apiResponse.contractForm?.url,
                      apiResponse.contractForm?.fileName
                    )
                  }
                   title="Download Document"
                  className="flex items-center justify-center w-8 h-8  bg-green-100 text-green-600 rounded-sm hover:bg-green-200 transition-all disabled:opacity-50 cursor-pointer"
                  disabled={
                    downloadingFile === apiResponse.contractForm?.fileName
                  }
                >
                  {downloadingFile === apiResponse.contractForm?.fileName ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Additional Documents */}
      {Array.isArray(apiResponse.additionalDocs) &&
  apiResponse.additionalDocs.length > 0 && (
    <div className="bg-white rounded-md shadow-lg border border-gray-200 p-6 transition-all duration-300">

      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
        <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Additional Documents
        </h3>
      </div>

      {/*  2 COLUMN GRID + NUMBERING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {apiResponse.additionalDocs.map((doc, index) => (
          <div
            key={doc._id || index}
            className="flex items-center justify-between bg-gray-50 rounded-md p-4 border border-gray-200  transition-colors"
          >
            <div className="flex items-center gap-4">

              {/* ✔ NUMBERING */}
              <div className="text-lg font-bold text-gray-700 w-8 text-center">
                {index + 1}.
              </div>

              <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>

              <div>
                <p className="text-gray-900 font-semibold">{doc.docTitle}</p>
                <p className="text-gray-500 text-sm">{doc.fileName}</p>
              </div>
            </div>

            {(doc.public_url || doc.url) && (
              <div className="flex gap-3">

                {/* VIEW ICON BUTTON */}
                <a
                  href={doc.public_url || doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Document"
                  className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-sm transition-all duration-200"
                >
                  <Eye size={16} />
                </a>

                {/* DOWNLOAD ICON BUTTON */}
                <button
                  title="Download Document"
                  onClick={() =>
                    handleDownload(
                      doc.public_url || doc.url,
                      doc.fileName || "document"
                    )
                  }
                  className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-sm hover:bg-green-200 transition-all disabled:opacity-50 cursor-pointer"
                  disabled={downloadingFile === doc.fileName}
                >
                  {downloadingFile === doc.fileName ? (
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download size={16} />
                  )}
                </button>

              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  )}

      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-md p-4 border border-gray-200  transition-all duration-200">
    <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">
      {label}
    </p>
    <p className="text-gray-900 font-semibold text-base">{value || "—"}</p>
  </div>
);

export default DynamicProfileView;
