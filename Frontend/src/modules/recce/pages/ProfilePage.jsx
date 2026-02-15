import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetEmployeeByIdQuery } from "@/api/hr/employee.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import docPdf from "@/assets/doc.pdf";
import {
  Phone,
  Mail,
  Calendar,
  ExternalLink,

  CheckCircle2,
  UploadCloud,

} from "lucide-react";

// Reusable Components to keep code clean
const SectionCard = ({ title, children, className = "" }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}
  >
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const FieldGroup = ({
  label,
  value,
  onChange,
  fullWidth = false,
  isEditMode,
}) => (
  <div className={`flex flex-col ${fullWidth ? "col-span-2" : ""}`}>
    <label className="text-xs font-semibold text-gray-500 mb-1">{label}</label>
    {isEditMode ? (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-blue-300 rounded px-3 py-2 text-sm text-gray-800 outline-none"
      />
    ) : (
      <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 cursor-not-allowed">
        {value}
      </div>
    )}
  </div>
);

const StatCard = ({ title, value, colorClass = "text-blue-600" }) => (
  <div className="border border-gray-100 rounded-lg p-4 flex flex-col items-center justify-center bg-white shadow-sm">
    <span className="text-sm font-semibold text-gray-600 mb-1">{title}</span>
    <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
  </div>
);

const ToggleSwitch = ({ isOn, label }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div
      className={`w-10 h-5 rounded-full flex items-center px-1 duration-300 ${isOn ? "bg-blue-100" : "bg-red-100"
        }`}
    >
      <div
        className={`w-3 h-3 rounded-full shadow-md transform duration-300 ${isOn ? "translate-x-5 bg-blue-500" : "translate-x-0 bg-red-400"
          }`}
      ></div>
      <span
        className={`text-[9px] font-bold ml-auto ${isOn ? "text-blue-600" : "hidden"
          }`}
      >
        ON
      </span>
      <span
        className={`text-[9px] font-bold mr-auto ${!isOn ? "text-red-500" : "hidden"
          }`}
      >
        OFF
      </span>
    </div>
  </div>
);

const UploadBox = ({ text, onChange }) => (
  <label className="border border-gray-200 bg-gray-50 rounded px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition">
    <UploadCloud size={16} className="text-gray-400" />
    <span className="text-sm text-gray-500">{text}</span>
    <input type="file" className="hidden" onChange={onChange} />
  </label>
);

const ProfilePage = () => {
  const userData = useSelector((state) => state.auth?.userData);
  const profileId = userData?.user?.profileId;
  const isEditMode = false;
  const [formState, setFormState] = useState({});

  // Removed useGetRecceProfileByIdQuery
  console.log({ profileId });
  const { data: employeeProfileData, isLoading: isEmployeeLoading } =
    useGetEmployeeByIdQuery(
      { id: profileId },
      {
        skip: !profileId,
      }
    );
  console.log("Employee Profile Data:", employeeProfileData);
  // Removed useUpdateRecceProfileMutation and useUploadRecceDocumentsMutation

  React.useEffect(() => {
    if (!employeeProfileData?.data) return;

    // Prefer employee profile
    const data = employeeProfileData?.data || {};
    console.log("Profile Data:", data);
    // Map documents array to individual fields
    const docs = {};
    data.documents?.forEach((doc) => {
      if (doc.type === "Aadhaar") docs.aadharImage = doc.public_url;
      if (doc.type === "PAN") docs.panImage = doc.public_url;
      if (doc.type === "Passbook") docs.chequeImage = doc.public_url;
    });

    // Format date helper
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    setFormState({
      name: data.name || userData?.name || userData?.fullName || "N/A",
      email: data.email || userData?.email || "N/A",
      phone: data.phone || userData?.phone || userData?.mobile || "N/A",
      gender: data.gender || "N/A",
      dob: formatDate(data.dob),
      bloodGroup: data.bloodGroup || "N/A",
      address: data.currentAddress || "N/A",
      maritalStatus: data.maritalStatus || "N/A",
      qualification: data.qualification || "N/A",
      alternateNo: data.alternateNo || "N/A",
      workEmail: data.workEmail || "N/A",

      emergencyContactPerson: data.emergencyContact?.name || "N/A",
      emergencyContactNumber: data.emergencyContact?.phone || "N/A",
      emergencyContactRelation: data.emergencyContact?.relation || "N/A",

      department: data.departmentId?.title || "N/A",
      position: data.designationId?.title || "N/A",
      branch: data.branchId?.title || "N/A",
      zone: data.zoneId?.title || "N/A",
      state: data.stateId?.title || data.state || "N/A",
      city: data.cityId?.title || data.city || "N/A",
      joinedDate: formatDate(data.joiningDate),
      employeeId: data.employeeId || "N/A",
      employeeType: data.employeeType || "N/A",
      // status: data.status || "N/A",
      workLocation: data.workLocation || "N/A",

      bankName: data.bankDetail?.bankName || "N/A",
      accountHolderName: data.bankDetail?.accountHolderName || "N/A",
      accountNumber: data.bankDetail?.accountNumber || "N/A",
      ifscCode: data.bankDetail?.ifscCode || "N/A",
      branchName: data.bankDetail?.branchName || "N/A",

      ctc: data.salary?.ctc || 0,
      basic: data.salary?.basic || 0,
      hra: data.salary?.hra || 0,
      allowances: data.salary?.allowances || 0,
      deductions: data.salary?.deductions || 0,

      pfAccountNo: data.pfAccountNo || "N/A",
      uan: data.uan || "N/A",
      esicNo: data.esicNo || "N/A",

      profileImage: data.photo,
      ...docs,
    });
  }, [employeeProfileData, userData]);
  console.log("Form State:", formState);
  const handleUploadImage = (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState((prev) => ({
        ...prev,
        [key]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const navigate = useNavigate();
  const handleOpenDigitalID = () => navigate("/digital-id");
  const handleChangePassword = () => navigate("/change-password");
  const handleLogout = () => navigate("/logout");
  const downloadPdf = () => {
    try {
      const link = document.createElement("a");
      link.href = docPdf;
      link.download = "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };
  const handleDownloadSOP = () => downloadPdf();
  const handleDownloadGuidelines = () => downloadPdf();


  const isLoading = isEmployeeLoading;

  if (isLoading) return <div className="p-6">Loading profile...</div>;
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 relative">
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <button
              onClick={handleOpenDigitalID}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-100 transition cursor-pointer"
            >
              <ExternalLink size={16} /> Open Digital ID
            </button>
            <button
              className="text-gray-400 p-1 rounded cursor-not-allowed"
              disabled
              title="Profile editing is disabled"
            >

            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
              <img
                src={
                  formState.profileImage ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {formState.name}
                </h1>
                <span
                  className={`text-xs px-2 py-0.5 rounded border ${formState.status === "Active"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : formState.status === "Onboarding"
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                >
                  {formState.status}
                </span>
              </div>
              <p className="text-gray-500 font-medium mb-1">
                {formState.position} • {formState.employeeId}
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {formState.department} • {formState.branch}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-blue-500">
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded cursor-pointer">
                  <Phone size={14} /> {formState.phone}
                </div>
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded cursor-pointer">
                  <Mail size={14} /> {formState.email}
                </div>
                <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded">
                  <Calendar size={14} /> Joined: {formState.joinedDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Main Info) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Information */}
            <SectionCard title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup
                  label="Name"
                  value={formState.name}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, name: v })}
                />
                <FieldGroup
                  label="Phone"
                  value={formState.phone}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, phone: v })}
                />
                <FieldGroup
                  label="Email"
                  value={formState.email}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, email: v })}
                />
                <FieldGroup
                  label="Address"
                  value={formState.address}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, address: v })}
                />
                <FieldGroup
                  label="Date Of Birth"
                  value={formState.dob}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, dob: v })}
                />
                <FieldGroup
                  label="Gender"
                  value={formState.gender}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, gender: v })}
                />
                <FieldGroup
                  label="Blood Group"
                  value={formState.bloodGroup}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, bloodGroup: v })
                  }
                />
                <FieldGroup
                  label="Marital Status"
                  value={formState.maritalStatus}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, maritalStatus: v })
                  }
                />
                <FieldGroup
                  label="Qualification"
                  value={formState.qualification}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, qualification: v })
                  }
                />
                <FieldGroup
                  label="Emergency Contact Person"
                  value={formState.emergencyContactPerson}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, emergencyContactPerson: v })
                  }
                />
                <FieldGroup
                  label="Emergency Contact Relation"
                  value={formState.emergencyContactRelation}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, emergencyContactRelation: v })
                  }
                />
                <FieldGroup
                  label="Emergency Contact Number"
                  value={formState.emergencyContactNumber}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, emergencyContactNumber: v })
                  }
                />
              </div>
            </SectionCard>

            {/* Work Information */}
            <SectionCard title="Work Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup
                  label="Employee ID"
                  value={formState.employeeId}
                  isEditMode={false}
                  onChange={() => { }}
                />
                <FieldGroup
                  label="Employee Type"
                  value={formState.employeeType}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, employeeType: v })
                  }
                />
                <FieldGroup
                  label="Department"
                  value={formState.department}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, department: v })
                  }
                />
                <FieldGroup
                  label="Position"
                  value={formState.position}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, position: v })}
                />
                <FieldGroup
                  label="Branch"
                  value={formState.branch}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, branch: v })}
                />
                <FieldGroup
                  label="Zone"
                  value={formState.zone}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, zone: v })}
                />
                <FieldGroup
                  label="State"
                  value={formState.state}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, state: v })}
                />
                <FieldGroup
                  label="City"
                  value={formState.city}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, city: v })}
                />
                <FieldGroup
                  label="Joined Date"
                  value={formState.joinedDate}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, joinedDate: v })
                  }
                />
                <FieldGroup
                  label="Work Location"
                  value={formState.workLocation}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, workLocation: v })
                  }
                />
                {/* <FieldGroup
                  label="Status"
                  value={formState.status}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, status: v })}
                /> */}
              </div>
            </SectionCard>

            {/* Salary Information */}
            <SectionCard title="Salary Information">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  title="CTC"
                  value={`₹${formState.ctc?.toLocaleString("en-IN") || "0"}`}
                />
                <StatCard
                  title="Basic Salary"
                  value={`₹${formState.basic?.toLocaleString("en-IN") || "0"}`}
                />
                <StatCard
                  title="HRA"
                  value={`₹${formState.hra?.toLocaleString("en-IN") || "0"}`}
                />
                <StatCard
                  title="Allowances"
                  value={`₹${formState.allowances?.toLocaleString("en-IN") || "0"
                    }`}
                />
                <StatCard
                  title="Deductions"
                  value={`₹${formState.deductions?.toLocaleString("en-IN") || "0"
                    }`}
                />
              </div>
            </SectionCard>

            {/* Statutory Information */}
            <SectionCard title="Statutory Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup
                  label="PF Account No"
                  value={formState.pfAccountNo}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, pfAccountNo: v })
                  }
                />
                <FieldGroup
                  label="UAN"
                  value={formState.uan}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, uan: v })}
                />
                <FieldGroup
                  label="ESIC No"
                  value={formState.esicNo}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, esicNo: v })}
                />
              </div>
            </SectionCard>

            {/* Commission Structure */}
            {/* <SectionCard title="Commission Structure">
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 mb-6 ml-2">
                <li>Recce Task Completion: ₹150 per site</li>
                <li>Approved Report Bonus: ₹50 per approved report</li>
                <li>Accuracy Bonus: Up to ₹500 per month</li>
                <li>On-Time Submission Bonus: ₹200 per month</li>
              </ul>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Monthly Target Progress
                  </span>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                    95%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "95%" }}
                  ></div>
                </div>
              </div>
            </SectionCard> */}

            {/* Performance Summary */}
            <SectionCard title="Performance Summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                  title="Total Recces Completed"
                  value="148"
                  colorClass="text-blue-700"
                />
                <StatCard
                  title="Accuracy Score (Average)"
                  value="94%"
                  colorClass="text-blue-700"
                />
                <StatCard
                  title="On-Time Submissions"
                  value="89%"
                  colorClass="text-blue-700"
                />
                <StatCard
                  title="Rejected Reports"
                  value="2"
                  colorClass="text-blue-700"
                />
              </div>
            </SectionCard>
          </div>

          {/* Right Column (Sidebars) */}
          <div className="lg:col-span-4 space-y-6">
            {/* KYC & Verification */}
            <SectionCard title="KYC & Verification" className="relative">
              <div className="absolute top-6 right-6 bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Aadhar Card Image
                  </label>
                  {formState.aadharImage ? (
                    <img
                      src={formState.aadharImage}
                      className="w-24 h-24 rounded mt-2"
                    />
                  ) : (
                    <p className="text-xs text-gray-400">
                      No Aadhaar image available
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    PAN Card Image
                  </label>
                  {formState.panImage ? (
                    <img
                      src={formState.panImage}
                      className="w-24 h-24 rounded mt-2"
                    />
                  ) : (
                    <p className="text-xs text-gray-400">
                      No PAN image available
                    </p>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* Bank Details */}
            <SectionCard title="Bank Details">
              <div className="space-y-4">
                <FieldGroup
                  label="Account Holder Name"
                  value={formState.accountHolderName}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, accountHolderName: v })
                  }
                />
                <FieldGroup
                  label="Bank Name"
                  value={formState.bankName}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, bankName: v })}
                />
                <FieldGroup
                  label="Account Number"
                  value={formState.accountNumber}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, accountNumber: v })
                  }
                />
                <FieldGroup
                  label="IFSC Code"
                  value={formState.ifscCode}
                  isEditMode={isEditMode}
                  onChange={(v) => setFormState({ ...formState, ifscCode: v })}
                />
                <FieldGroup
                  label="Branch Name"
                  value={formState.branchName}
                  isEditMode={isEditMode}
                  onChange={(v) =>
                    setFormState({ ...formState, branchName: v })
                  }
                />
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Cheque
                  </label>

                  {formState.chequeImage && (
                    <img
                      src={formState.chequeImage}
                      className="w-24 h-24 rounded mt-2"
                    />
                  )}
                </div>
              </div>
            </SectionCard>

            {/*
            <SectionCard title="System Preferences">
              <div className="space-y-4">
                <FieldGroup label="GPS Accuracy Mode" value="High Accuracy" isEditMode={isEditMode} />

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-2 block">
                    Notification Preferences
                  </label>
                  <div className="border border-gray-100 rounded p-2 bg-gray-50">
                    <ToggleSwitch isOn={true} label="Task Reminders" />
                    <ToggleSwitch isOn={true} label="Report Status Updates" />
                    <ToggleSwitch isOn={false} label="Weekly Summery" />
                  </div>
                </div>

                <FieldGroup label="Device Model" value="iPhone 13" isEditMode={isEditMode} />
                <FieldGroup label="App Version" value="2.4.1" isEditMode={isEditMode} />
                <FieldGroup label="Last Sync" value="Today, 3:45 PM" isEditMode={isEditMode} />

                <div className="space-y-2">
                  {["Camera", "Location", "Storage", "Background Sync"].map(
                    (perm) => (
                      <div
                        key={perm}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100"
                      >
                        <span className="text-sm text-gray-600">{perm}</span>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-medium">
                          Enabled
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </SectionCard>
            */}

            {/* Documents */}
            <SectionCard title="Documents">
              <div className="space-y-2">
                <div className="flex items-center justify-between border border-gray-200 rounded p-2 bg-gray-50">
                  <span className="text-sm text-gray-600">SOP PDF</span>
                  <button
                    onClick={handleDownloadSOP}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 font-medium hover:bg-blue-100 cursor-pointer"
                  >
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between border border-gray-200 rounded p-2 bg-gray-50">
                  <span className="text-sm text-gray-600">Guidelines</span>
                  <button
                    onClick={handleDownloadGuidelines}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 font-medium hover:bg-blue-100 cursor-pointer"
                  >
                    Download
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Footer Buttons */}
        {/* <div className="flex justify-end gap-3 mt-8 pb-8">
          <button
            onClick={handleChangePassword}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded font-medium shadow-sm transition cursor-pointer"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium shadow-sm transition cursor-pointer"
          >
            Logout
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
