import React, { useState } from "react";
import { FaEdit, FaCamera, FaEye, FaDownload } from "react-icons/fa";
import ProfileUpdateModal from "../components/ProfileUpdateModal";
import { CgProfile } from "react-icons/cg";
import {
  useGetVendorProfileQuery,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,
} from "@/api/vendor/profileManagement.api";
import DataLoading from "../components/DataLoading";
import { toast } from "react-toastify";
import { useLazyGetVendorByIdQuery } from "@/api/admin/vendor-profile-management/vendor.management.api";
import { Download, Eye, FileText, User } from "lucide-react";
const VendorProfilePage = () => {
  // Local optimistic state
  const [previewImage, setPreviewImage] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);

  //  Fetch vendor profile details
  const { data, isLoading, isFetching, isError } = useGetVendorProfileQuery();

  const apiResponse = data?.data;
  console.log("profile data is -", data);

  const sections = [
    {
      title: "Business & Personal Details",
      fields: [
        {
          name: "contactPersonName",
          label: "Contact Person Name",
          path: "apiResponse.contactPersonName",
        },
        {
          name: "businessName",
          label: "Business Name",
          path: "apiResponse.businessName",
        },
        {
          name: "email",
          label: "Email Address",
          path: "apiResponse.email",
        },
        {
          name: "contact",
          label: "Contact Number",
          path: "apiResponse.contactNumber",
        },
        {
          name: "altContact",
          label: "Alternate Contact",
          path: "apiResponse.alternateContact",
        },
      ],
    },
    {
      title: "Business Address",
      fields: [
        { name: "street", label: "Street", path: "apiResponse.address" },
        { name: "city", label: "City", path: "apiResponse.city" },
        { name: "state", label: "State", path: "apiResponse.state" },
        {
          name: "pincode",
          label: "Pincode",
          path: "apiResponse.pincode",
        },
      ],
    },
    {
      title: "KYC Details",
      fields: [
        {
          name: "gst",
          label: "GST Number",
          path: "apiResponse.gstNumber",
        },
        {
          name: "pan",
          label: "PAN Number",
          path: "apiResponse.panNumber",
        },
        {
          name: "aadhar",
          label: "Aadhar Number",
          path: "apiResponse.aadharNumber",
        },
        {
          name: "bank",
          label: "Bank Name",
          path: "apiResponse.bankName",
        },
        {
          name: "accountNumber",
          label: "Account Number",
          path: "apiResponse.accountNumber",
        },
        {
          name: "ifsc",
          label: "IFSC Code",
          path: "apiResponse.ifscCode",
        },
      ],
    },
  ];

  const defaultValues = {
    // Personal Info
    contactPersonName: apiResponse?.contactPersonName || "",
    businessName: apiResponse?.businessName || "",
    email: apiResponse?.email || "",
    contact: apiResponse?.contactNumber || "",
    altContact: apiResponse?.alternateContact || "",

    // Address
    street: apiResponse?.address || "",
    city: apiResponse?.city || "",
    state: apiResponse?.state || "",
    pincode: apiResponse?.pincode || "",

    // KYC Details
    gst: apiResponse?.gstNumber || "",
    pan: apiResponse?.panNumber || "",
    aadhar: apiResponse?.aadharNumber || "",
    bank: apiResponse?.bankName || "",
    accountNumber: apiResponse?.accountNumber || "",
    ifsc: apiResponse?.ifscCode || "",
  };

  // send form data to backend for update
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const handleUpdate = async (data) => {
    const transformData = (data) => {
      return {
        // address: {
        //   area: data.area,
        //   city: data.city,
        //   pincode: data.pincode,
        //   state: data.state,
        //   street: data.street,
        // },
        // kycDetails: {
        aadharNumber: data.aadhar,
        accountNumber: data.accountNumber,
        bankName: data.bank,
        gstNumber: data.gst,
        ifscCode: data.ifsc,
        panNumber: data.pan,
        // },
        // personalInfo: {
        //   alternateContact: data.altContact,
        //   businessName: data.businessName,
        //   contactNumber: data.contact,
        //   contactPersonName: data.contactPersonName,
        //   email: data.email,
        // },
      };
    };

    const formData = transformData(data);
    console.log("Updated Profile:", formData);

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // api call for image profile change
  const [updateProfileImage, { isLoading: isProfileImageUpdating }] =
    useUpdateProfileImageMutation();

  // jab backend se new image aa jaye tab preview reset karo
  React.useEffect(() => {
    if (apiResponse?.profileImage?.public_url) {
      setPreviewImage(null);
    }
  }, [apiResponse?.profileImage?.public_url]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    // console.log("Selected file:", file);

    if (!file) {
      // console.log("No file selected, skipping upload");
      return; //  cancel kar diya hai, kuch mat karo
    }
    if (file) {
      // Preview ke liye
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Base64 image
      };
      reader.readAsDataURL(file);
    }

    // ✅ FormData banao
    const formData = new FormData();
    formData.append("profileImage", file);

    // Debug ke liye entries print karo
    for (let [key, value] of formData.entries()) {
      console.log("FormData ->", key, value);
    }

    try {
      const res = await updateProfileImage({ formData }).unwrap();
      toast.success("Profile image updated!");

      // Reset preview (ab server ka data aayega)
      // setPreviewImage(null);
      console.log("res is ----", res);
    } catch (error) {
      toast.error(error?.data?.message || "Upload failed!");
      console.log("Upload error:", error);
      setPreviewImage(null); // fail hone par preview hata do
    }
  };

  if (isFetching || isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
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
          <p className="text-gray-600">Unable to fetch Vendor data</p>
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
          <p className="text-gray-600">No data found for this Vendor</p>
        </div>
      </div>
    );
  }

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

  const isKycComplete = () => {
    const kycFields = sections.find((s) => s.title === "KYC Details")?.fields;

    return kycFields?.every((field) => {
      const val = eval(field.path); // apiResponse se value niklegi
      return val !== undefined && val !== null && val !== "";
    });
  };

  return (
    <>
      {/* Header */}
      <div className="w-full rounded-xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-[1px] shadow mb-5">
        <div className="bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <CgProfile className="w-6 h-6 text-orange-500" />
            <span>My Profile</span>
          </h2>
        </div>
      </div>

      {/* Agar loading hai to spinner dikhana hai */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <DataLoading />
        </div>
      ) : (
        <>
          {/* Main Container */}
          <div className="flex flex-col lg:flex-row gap-5 mb-5">
            {/* Profile Card - 30% */}
            <div className="bg-white rounded-xl shadow border border-gray-300 p-6 flex flex-col items-center gap-4 flex-[3] lg:basis-[20%]">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={
                    previewImage || //  Optimistic preview (local state)
                    apiResponse?.profileImage?.public_url ||
                    apiResponse?.profileImage?.url || // backend ka data
                    "https://i.pravatar.cc/100?img=13" //  Default fallback
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow object-cover"
                />
                <label
                  htmlFor="upload-photo"
                  className="absolute bottom-0 right-0 bg-green-100 border border-white rounded-full p-1 cursor-pointer shadow"
                >
                  <FaCamera size={14} />
                </label>
                <input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {/*  Uploading Overlay */}
                {isProfileImageUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="text-center">
                {/* <h2 className="text-xl font-semibold text-black">
      {apiResponse?.businessName}
    </h2> */}
                <p className="text-lg font-semibold text-black">
                  {apiResponse.contactPersonName}
                </p>
                <p className="text-gray-600">{apiResponse.city}</p>
              </div>
            </div>

            {/* Business Address Card - 70% */}
            <div className="bg-white rounded-xl shadow border border-gray-300 p-6 relative flex-[7] lg:basis-[70%]">
              <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
                <h3 className="text-lg font-semibold text-green-900">
                  Business Address
                </h3>
                {/* <button
                  onClick={() => {
                    setEditingSection("Business Address");
                    setOpen(true);
                  }}
                  className="flex items-center gap-1 px-4 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Edit <FaEdit size={14} />
                </button> */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sections
                  .find((s) => s.title === "Business Address")
                  ?.fields.map((field) => (
                    <Info
                      key={field.name}
                      label={field.label}
                      value={eval(field.path)}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Business & Personal Info Card */}
          <div className="bg-white rounded-xl shadow border border-gray-300 p-6 relative mb-5">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
              <h3 className="text-lg font-semibold text-green-900">
                Business & Personal Details
              </h3>
              {/* <button
                onClick={() => {
                  setEditingSection("Business & Personal Details");
                  setOpen(true);
                }}
                className="flex items-center gap-1 px-4 py-1 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
              >
                Edit <FaEdit size={14} />
              </button> */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections
                .find((s) => s.title === "Business & Personal Details")
                ?.fields.map((field) => (
                  <Info
                    key={field.name}
                    label={field.label}
                    value={eval(field.path)} // 👈 apiResponse se value auto niklegi
                  />
                ))}
            </div>
          </div>

          {/* KYC Details */}
          <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
              <h3 className="text-lg font-semibold text-green-900">
                KYC Details
              </h3>

              {/* Show EDIT only if any field is empty */}
              {!isKycComplete() && (
                <button
                  onClick={() => {
                    setEditingSection("KYC Details");
                    setOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
                >
                  Edit <FaEdit size={14} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {sections
                .find((s) => s.title === "KYC Details")
                ?.fields.map((field) => (
                  <Info
                    key={field.name}
                    label={field.label}
                    value={eval(field.path)}
                  />
                ))}
            </div>
          </div>

          {/* Contract Form */}
          <div className="bg-white rounded-md shadow-md border border-gray-200 p-6 transition-all duration-300 mt-5">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-green-900">
                Contract Form
              </h3>
            </div>

            {/* Card Body */}
            <div className="flex items-center justify-between bg-gray-50 rounded-md p-4 border border-gray-200 transition-colors">
              <div className="flex items-center gap-4">
                {/* File Icon */}
                <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>

                {/* File Details */}
                <div>
                  <p className="text-gray-900 font-semibold">
                    {apiResponse.contractForm?.docTitle || "Contract Document"}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {apiResponse.contractForm?.fileName || "No file uploaded"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {apiResponse.contractForm &&
              (apiResponse.contractForm.public_url ||
                apiResponse.contractForm.url) ? (
                <div className="flex gap-3">
                  {/* View Link */}
                  <a
                    href={
                      apiResponse.contractForm.public_url ||
                      apiResponse.contractForm.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Document"
                    className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-sm transition-all duration-200"
                  >
                    <Eye size={16} />
                  </a>

                  {/* Download Button */}
                  <button
                    onClick={() =>
                      handleDownload(
                        apiResponse.contractForm.public_url ||
                          apiResponse.contractForm.url,
                        apiResponse.contractForm.fileName || "contract_document"
                      )
                    }
                    className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-sm hover:bg-green-200 transition-all disabled:opacity-50"
                    disabled={
                      downloadingFile === apiResponse.contractForm?.fileName
                    }
                  >
                    {downloadingFile === apiResponse.contractForm?.fileName ? (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No actions available</p>
              )}
            </div>
          </div>

          {Array.isArray(apiResponse.additionalDocs) &&
            apiResponse.additionalDocs.length > 0 && (
              <div className="bg-white rounded-md shadow-md border border-gray-200 p-6 transition-all duration-300 mt-5">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
                  <h3 className="text-lg font-semibold text-green-900">
                    Additional Documents
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiResponse.additionalDocs.map((doc, index) => {
                    const fileUrl = doc.public_url || doc.url;
                    const fileName = doc.fileName || "No file uploaded";

                    return (
                      <div
                        key={doc._id || index}
                        className="flex items-center justify-between bg-gray-50 rounded-md p-4 border border-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold text-gray-700 w-8 text-center">
                            {index + 1}.
                          </div>

                          <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-indigo-600" />
                          </div>

                          <div>
                            <p className="text-gray-900 font-semibold">
                              {doc.docTitle || "Untitled Document"}
                            </p>

                            <p className="text-gray-500 text-sm">{fileName}</p>
                          </div>
                        </div>

                        {/* 🔥 Actions Section (View + Download OR Fallback Message) */}
                        {fileUrl ? (
                          <div className="flex gap-3">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Document"
                              className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-sm transition-all duration-200"
                            >
                              <Eye size={16} />
                            </a>

                            <button
                              title="Download Document"
                              onClick={() =>
                                handleDownload(
                                  fileUrl,
                                  doc.fileName || "document"
                                )
                              }
                              className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-sm hover:bg-green-200 transition-all disabled:opacity-50"
                              disabled={downloadingFile === doc.fileName}
                            >
                              {downloadingFile === doc.fileName ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Download size={16} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No actions available
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </>
      )}

      <ProfileUpdateModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditingSection(null);
        }}
        isUpdating={isUpdating}
        onSubmit={handleUpdate}
        title={`✏️ Update ${editingSection}`}
        fields={sections.find((s) => s.title === editingSection)?.fields || []}
        defaultValues={defaultValues}
      />
    </>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-black text-sm font-semibold">{label}</p>
    <p className="text-gray-500 font-medium">{value || "—"}</p>
  </div>
);

export default VendorProfilePage;
