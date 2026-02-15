import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  FileText,
  Upload,
  X,
  Building2,
  Mail,
  Phone,
  CreditCard,
  File as FileIcon,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateFranchiseMutation,
  useLazyGetFranchiseByIdQuery,
  useUpdateFranchiseMutation,
} from "@/api/admin/franchise-profile-management/franchise.management.api";
import { toast } from "react-toastify";

// File Upload Component
const FileUpload = ({
  label,
  name,
  accept,
  file,
  onChange,
  onRemove,
  formdata,
}) => (
  <div className="space-y-2">
    <label className=" text-xs font-semibold text-gray-700 flex items-center gap-1.5">
      <Upload size={14} className="text-indigo-600" />
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="hidden"
        id={name}
      />
      <label
        htmlFor={name}
        className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group bg-white"
      >
        <Upload className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 mr-2 transition-colors" />
        <span className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors font-medium truncate">
          {file?.name || formdata?.fileName || `Choose ${label}`}
        </span>
      </label>
      {file && (
        <button
          type="button"
          onClick={() => onRemove(name)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  </div>
);

const FranchiseManagementForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [fetchFranchise, { data: franchiseData, isLoading: isFetching }] =
    useLazyGetFranchiseByIdQuery();
  const [createFranchise, { isLoading: isCreating }] =
    useCreateFranchiseMutation();
  const [updateFranchise, { isLoading: isUpdating }] =
    useUpdateFranchiseMutation();

  const existingFranchise = franchiseData?.data;

  const initialFormData = {
    contactPersonName: "",
    contactNumber: "",
    alternateContact: "",
    email: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    aadharNumber: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    profileImage: null,
    contractForm: null,
    additionalDocs: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [newDoc, setNewDoc] = useState({ docTitle: "", file: null });
  const [errors, setErrors] = useState({});

  // Fetch Franchise if editing
  useEffect(() => {
    if (id) fetchFranchise(id);
  }, [id]);

  // Populate existing Franchise data
  useEffect(() => {
    if (!existingFranchise) return;

    const { profileImage, contractForm, additionalDocs, ...rest } =
      existingFranchise;

    setFormData({
      ...initialFormData,
      ...rest,
      profileImage: profileImage || null,
      contractForm: contractForm || null,
      additionalDocs:
        additionalDocs?.map((d) => ({
          docTitle: d.docTitle,
          fileData: d, // DB object
          existing: true,
        })) || [],
    });
  }, [existingFranchise]);

  // Validators
  const validators = {
    contactPersonName: (val) =>
      !val || val.trim() === ""
        ? "Required"
        : /^[A-Za-z\s]+$/.test(val)
        ? ""
        : "Only letters allowed",
    contactNumber: (val) =>
      /^[6-9]\d{9}$/.test(val || "")
        ? ""
        : "Must be 10 digits starting with 6, 7, 8, or 9",
    alternateContact: (val) =>
      !val || /^[6-9]\d{9}$/.test(val)
        ? ""
        : "Must be 10 digits starting with 6, 7, 8, or 9",
    email: (val) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})?$/.test(
        val || ""
      )
        ? ""
        : "Invalid email",
    businessName: (val) => (!val || val.trim() === "" ? "Required" : ""),
    address: (val) => (!val || val.trim() === "" ? "Required" : ""),
    city: (val) =>
      !val || val.trim() === ""
        ? "Required"
        : /^[A-Za-z\s]+$/.test(val)
        ? ""
        : "Only letters allowed",
    state: (val) =>
      !val || val.trim() === ""
        ? "Required"
        : /^[A-Za-z\s]+$/.test(val)
        ? ""
        : "Only letters allowed",
    pincode: (val) =>
      /^[0-9]{6}$/.test(val || "") ? "" : "Pincode must be 6 digits",
    gstNumber: (val) =>
      !val ||
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val)
        ? ""
        : "Invalid GST",
    panNumber: (val) =>
      !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val) ? "" : "Invalid PAN",
    aadharNumber: (val) =>
      !val || /^[0-9]{12}$/.test(val) ? "" : "Aadhaar must be 12 digits",
    bankName: (val) => "",
    accountNumber: (val) =>
      !val || /^[0-9]{9,18}$/.test(val) ? "" : "Account must be 9–18 digits",
    ifscCode: (val) =>
      !val || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val) ? "" : "Invalid IFSC",
  };

  // Change Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
  };

  const handleRemoveFile = (name) => {
    setFormData((prev) => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([k, v]) => {
      if (validators[k] && validators[k](v)) {
        newErrors[k] = validators[k](v);
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Additional Documents Handlers
  const handleAdditionalFileChange = (e) => {
    setNewDoc((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleAddDoc = () => {
    if (!newDoc.docTitle || !newDoc.file) {
      toast.error("Please add both title and file");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      additionalDocs: [...prev.additionalDocs, { ...newDoc }],
    }));

    setNewDoc({ docTitle: "", file: null });
    document.getElementById("additional-file-upload").value = "";
  };

  const handleRemoveDoc = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalDocs: prev.additionalDocs.filter((_, i) => i !== index),
    }));
  };

  const handleAdditionalDocChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedDocs = [...prev.additionalDocs];
      updatedDocs[index] = { ...updatedDocs[index], [field]: value };
      return { ...prev, additionalDocs: updatedDocs };
    });
  };

  // Submit
  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      const data = new FormData();

      // Normal fields
      Object.entries(formData).forEach(([key, value]) => {
        if (["profileImage", "contractForm", "additionalDocs"].includes(key))
          return;
        if (value !== null && value !== undefined) data.append(key, value);
      });

      // Before profileImage handling
      if (formData.profileImage === null) {
        data.append("removeProfileImage", "true");
      }

      // Profile Image
      if (formData.profileImage && formData.profileImage instanceof File)
        data.append("profileImage", formData.profileImage);

      // Before contractForm handling
      if (formData.contractForm === null) {
        data.append("removeContractForm", "true");
      }

      // Contract Form
      if (formData.contractForm && formData.contractForm instanceof File)
        data.append("contractForm", formData.contractForm);

      // Additional Docs
      formData.additionalDocs.forEach((doc) => {
        if (doc.file instanceof File) {
          // New file
          data.append("additionalDocs", doc.file);
          data.append("docTitles", doc.docTitle);
        } else if (doc.existing) {
          data.append(
            "existingDocs",
            JSON.stringify({
              docTitle: doc.docTitle,
              fileName: doc.fileData.fileName,
              fileType: doc.fileData.fileType,
              url: doc.fileData.url,
              public_url: doc.fileData.public_url,
              public_id: doc.fileData.public_id,
            })
          );
        }
      });

      let res;
      if (existingFranchise) {
        res = await updateFranchise({
          id: existingFranchise._id,
          data,
        }).unwrap();
        toast.success(res?.message || "Franchise updated successfully!");
      } else {
        res = await createFranchise(data).unwrap();
        toast.success(res?.message || "Franchise created successfully!");
        setFormData(initialFormData);
        setErrors({});
      }

      navigate(-1);
    } catch (error) {
      toast.error(error?.data?.message || "Error saving Franchise!");
      console.error(error);
    }
  };

  const renderInput = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
  }) => {
    const value = formData[name];
    const error = errors[name];

    return (
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
          {Icon && <Icon size={14} className="text-indigo-600" />}
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`border-2 rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-100 bg-white ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-300 focus:border-indigo-500"
          }`}
        />
        {error && (
          <span className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
            {error}
          </span>
        )}
      </div>
    );
  };

  if (id && isFetching) {
    return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-600">
            Loading franchise details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-8xl mx-auto space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-100">
          {/* Left side - Icon + Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Franchise Registration
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Complete Franchise information form
              </p>
            </div>
          </div>

          {/* Right side - Back Button */}
          <button
            onClick={() => navigate(-1)}
            disabled={isCreating || isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg px-4 py-3 mb-5 border-l-4 border-indigo-600">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <User size={18} className="text-indigo-600" />
              Personal Information
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {renderInput({
              label: "Contact Person Name",
              name: "contactPersonName",
              placeholder: "John Doe",
              icon: User,
            })}
            {renderInput({
              label: "Contact Number",
              name: "contactNumber",
              type: "tel",
              placeholder: "9876543210",
              icon: Phone,
            })}
            {renderInput({
              label: "Alternate Number (Optional)",
              name: "alternateContact",
              type: "tel",
              placeholder: "9876543210",
              icon: Phone,
            })}
            {renderInput({
              label: "Email Address",
              name: "email",
              type: "email",
              placeholder: "franchise@company.com",
              icon: Mail,
            })}
          </div>
          <div className="mt-5">
            {renderInput({
              label: "Business Name",
              name: "businessName",
              placeholder: "ABC Enterprises Pvt. Ltd.",
              icon: Building2,
            })}
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-8 pt-6 border-t-2 border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg px-4 py-3 mb-5 border-l-4 border-indigo-600">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-600" />
              Address Information
            </h3>
          </div>
          <div className="space-y-5">
            <div className="grid md:grid-cols-1 gap-5">
              {renderInput({
                label: "Address",
                name: "address",
                placeholder: "123, Andheri West, Mumbai",
                icon: MapPin,
              })}
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {renderInput({
                label: "City",
                name: "city",
                placeholder: "Mumbai",
                icon: Building2,
              })}
              {renderInput({
                label: "State",
                name: "state",
                placeholder: "Maharashtra",
                icon: MapPin,
              })}
              {renderInput({
                label: "Pincode",
                name: "pincode",
                type: "tel",
                placeholder: "400001",
                icon: MapPin,
              })}
            </div>
          </div>
        </div>

        {/* KYC & Banking Details */}
        <div className="mb-8 pt-6 border-t-2 border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg px-4 py-3 mb-5 border-l-4 border-indigo-600">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              KYC & Banking Details (Optional)
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {renderInput({
              label: "GST Number (Optional)",
              name: "gstNumber",
              placeholder: "22AAAAA0000A1Z5",
              icon: FileText,
            })}
            {renderInput({
              label: "PAN Number (Optional)",
              name: "panNumber",
              placeholder: "ABCDE1234F",
              icon: FileText,
            })}
            {renderInput({
              label: "Aadhar Number (Optional)",
              name: "aadharNumber",
              placeholder: "123456789012",
              icon: FileText,
            })}
            {renderInput({
              label: "Bank Name (Optional)",
              name: "bankName",
              placeholder: "State Bank of India",
              icon: CreditCard,
            })}
            {renderInput({
              label: "Account Number (Optional)",
              name: "accountNumber",
              placeholder: "1234567890",
              icon: CreditCard,
            })}
            {renderInput({
              label: "IFSC Code (Optional)",
              name: "ifscCode",
              placeholder: "SBIN0001234",
              icon: CreditCard,
            })}
          </div>
        </div>

        {/* Document Upload */}
        <div className="mb-8 pt-6 border-t-2 border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg px-4 py-3 mb-5 border-l-4 border-indigo-600">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Upload size={18} className="text-indigo-600" />
              Upload Documents (Optional)
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <FileUpload
              label="Profile Image"
              name="profileImage"
              accept="image/*"
              file={formData.profileImage}
              formdata={formData?.profileImage}
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
            />
            <FileUpload
              label="Contract Form (PDF)"
              name="contractForm"
              accept="application/pdf"
              file={formData.contractForm}
              formdata={formData?.contractForm}
              onChange={handleFileChange}
              onRemove={handleRemoveFile}
            />
          </div>
        </div>

        {/* Additional Documents Section */}
        <div className="mb-8 pt-6 border-t-2 border-gray-100">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg px-4 py-3 mb-5 border-l-4 border-indigo-600">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              Additional Documents (Optional)
            </h3>
          </div>

          {/* Input Section - Title, File, and Button in Same Row */}
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl p-5 border-2 border-gray-200 mb-5 shadow-sm">
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div>
                <label className=" text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo-600" />
                  Document Title
                </label>
                <input
                  type="text"
                  value={newDoc.docTitle}
                  onChange={(e) =>
                    setNewDoc((prev) => ({ ...prev, docTitle: e.target.value }))
                  }
                  placeholder="E.g. GST Certificate, Adhar Card"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                />
              </div>

              <div>
                <label className=" text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Upload size={14} className="text-indigo-600" />
                  Upload File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="additional-file-upload"
                    onChange={handleAdditionalFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="additional-file-upload"
                    className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-600 bg-white hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-all group"
                  >
                    <Upload
                      size={16}
                      className="text-gray-400 group-hover:text-indigo-600 transition-colors"
                    />
                    <span className="font-medium truncate group-hover:text-indigo-700 transition-colors">
                      {newDoc.file ? newDoc.file.name : "Choose file"}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddDoc}
                disabled={!newDoc.docTitle || !newDoc.file}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg h-[42px]"
              >
                <Plus size={18} />
                Add Document
              </button>
            </div>
          </div>

          {/* Display Added Documents */}
          {formData.additionalDocs.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  Uploaded Documents ({formData.additionalDocs.length})
                </h4>
              </div>
              {formData.additionalDocs.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 transition-all shadow-sm"
                >
                  <FileIcon
                    size={20}
                    className="text-indigo-600 flex-shrink-0"
                  />
                  <input
                    value={doc.docTitle}
                    onChange={(e) =>
                      handleAdditionalDocChange(
                        index,
                        "docTitle",
                        e.target.value
                      )
                    }
                    className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    placeholder="Document Title"
                  />
                  <span className="text-sm text-gray-600 flex-1 truncate">
                    {doc.file?.name ||
                      doc.file?.public_url?.split("/").pop() ||
                      "Uploaded"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(index)}
                    className="flex-shrink-0 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                    title="Remove document"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-indigo-50/20 rounded-xl border-2 border-dashed border-gray-300">
              <div className="inline-flex p-3 bg-indigo-100 rounded-full mb-3">
                <FileText size={28} className="text-indigo-600" />
              </div>
              <p className="text-sm text-gray-700 font-semibold">
                No documents added yet
              </p>
              <p className="text-xs text-gray-500 mt-1.5">
                Add your first document using the form above
              </p>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-100">
          <button
            onClick={() => navigate(-1)}
            disabled={isCreating || isUpdating}
            className="flex items-center gap-2 px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating || isUpdating}
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating || isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {existingFranchise ? "Updating..." : "Saving..."}
              </>
            ) : existingFranchise ? (
              "Update"
            ) : (
              "Register"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FranchiseManagementForm;
