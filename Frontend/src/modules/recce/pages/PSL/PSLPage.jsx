import React from "react";
import { ArrowLeft, Play, Download, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PSLPage = () => {
  const navigate = useNavigate();
  // Mock Data
  const productInfo = {
    code: "P-0976",
    name: "LED Frontlit Board",
    projectCode: "PR-87432",
    projectName: "Main Signage Branding",
  };

  const departments = [
    {
      name: "Recce Department",
      entries: [
        {
          id: "01",
          identifier: "Mr. Rahul Singh",
          category: "Size Measurement",
          problemName: "Product Measurement",
          description:
            "During the site recce and measurement activity, discrepancies were observed between the actual site conditions and the initially shared drawings/assumptions.",
          employee: "Mr. Aman Chauhan",
          reason: "Size Measurement Issue",
          audio: "audio.mp3",
          solution:
            "To address the recce measurement discrepancies, a joint re-verification of critical dimensions was conducted at the site with reference to actual conditions.",
          learning:
            "The recce and measurement exercise highlighted the importance of on-site verification over reliance on preliminary drawings. It reinforced the need to account for existing site conditions, services, and access limitations during the measurement process.",
        },
        {
          id: "02",
          identifier: "Mr. Rahul Singh",
          category: "Size Measurement",
          problemName: "Product Measurement",
          description:
            "During the site recce and measurement activity, discrepancies were observed between the actual site conditions and the initially shared drawings/assumptions.",
          employee: "Mr. Aman Chauhan",
          reason: "Size Measurement Issue",
          audio: "audio.mp3",
          solution:
            "To address the recce measurement discrepancies, a joint re-verification of critical dimensions was conducted at the site with reference to actual conditions.",
          learning:
            "The recce and measurement exercise highlighted the importance of on-site verification over reliance on preliminary drawings. It reinforced the need to account for existing site conditions, services, and access limitations during the measurement process.",
        },
      ],
    },
    {
      name: "Design Department",
      entries: [
        {
          id: "01",
          identifier: "Mr. Rahul Singh",
          category: "Design Measurement",
          problemName: "Design Size Deviation",
          description:
            "During the design stage, a mismatch was identified between the dimensions used in the design drawings and the actual site measurements obtained during recce.",
          employee: "Mr. Aman Chauhan",
          reason: "Design Development",
          audio: "audio.mp3",
          solution:
            "The design team coordinated with the site team to re-verify all critical dimensions. Design drawings were revised based on confirmed measurements, and standard design tolerances were incorporated.",
          learning:
            "This case reinforced the importance of confirming site measurements before final design development. It highlighted the need for clear coordination between design and site teams, proper validation of inputs, and a structured design approval process to avoid revisions and execution delays.",
        },
        {
          id: "02",
          identifier: "Mr. Rahul Singh",
          category: "Design Measurement",
          problemName: "Design Size Deviation",
          description:
            "During the design stage, a mismatch was identified between the dimensions used in the design drawings and the actual site measurements obtained during recce.",
          employee: "Mr. Aman Chauhan",
          reason: "Design Development",
          audio: "audio.mp3",
          solution:
            "The design team coordinated with the site team to re-verify all critical dimensions. Design drawings were revised based on confirmed measurements, and standard design tolerances were incorporated.",
          learning:
            "This case reinforced the importance of confirming site measurements before final design development. It highlighted the need for clear coordination between design and site teams, proper validation of inputs, and a structured design approval process to avoid revisions and execution delays.",
        },
      ],
    },
  ];

  // Reusable Input Component matched to new screenshot
  const ReadOnlyInput = ({ label, value, icon, className = "" }) => (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[14px] font-semibold text-gray-900">{label}</label>
      <div className="relative w-full">
        <div className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-600 text-[15px] rounded-md px-4 py-3 min-h-[46px] flex items-center shadow-sm">
          {value}
        </div>
        {icon && (
          <div className="absolute right-3 top-3.5 text-gray-500">{icon}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen   text-gray-900">
      {/* ================= HEADER ================= */}
      <div className=" bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold">Problem - Solution - Learning</h1>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 bg-blue-50 text-blue-600 font-medium text-sm rounded hover:bg-blue-100 transition cursor-pointer">
              Print
            </button>
            <button
              onClick={() =>
                navigate("/recce/psl-update/01", {
                  state: { mode: "edit" },
                })
              }
              className="px-5 py-2 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Edit PSL
            </button>
            <button
              onClick={() =>
                navigate("/recce/psl-update/01", { state: { mode: "add" } })
              }
              className="px-5 py-2 bg-blue-600 text-white font-medium text-sm rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Add PSL
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN BODY ================= */}
      <div className="max-w-full mx-auto py-6">
        {/* --- CARD 1: PRODUCT INFORMATION (Exact Match) --- */}
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[16px] font-bold text-gray-900">
              Product Information
            </h2>
          </div>
          {/* Card Body */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <ReadOnlyInput label="Product Code" value={productInfo.code} />
              <ReadOnlyInput label="Product Name" value={productInfo.name} />
              <ReadOnlyInput
                label="Project Code"
                value={productInfo.projectCode}
              />
            </div>
            <div className="w-full md:w-1/3 pr-2">
              <ReadOnlyInput
                label="Project Name"
                value={productInfo.projectName}
              />
            </div>
          </div>
        </div>

        {/* --- DEPARTMENT SECTIONS (Card Style for Separation) --- */}
        {departments.map((dept, deptIndex) => (
          <div
            key={deptIndex}
            className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="text-[16px] font-bold text-gray-900">
                {dept.name}
              </h2>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-10">
              {dept.entries.map((entry, entryIndex) => (
                <div key={entryIndex} className="space-y-5">
                  {/* Badge */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded">
                      S. No: {entry.id}
                    </span>
                  </div>

                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReadOnlyInput
                      label="Problem Identifier Name"
                      value={entry.identifier}
                    />
                    <ReadOnlyInput
                      label="Problem Category"
                      value={entry.category}
                      icon={<ChevronDown size={18} />}
                    />
                    <ReadOnlyInput
                      label="Problem Name"
                      value={entry.problemName}
                    />
                  </div>

                  {/* Row 2 */}
                  <ReadOnlyInput
                    label="Problem Description"
                    value={entry.description}
                  />

                  {/* Row 3 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReadOnlyInput
                      label="Employee/Incident Name"
                      value={entry.employee}
                    />
                    <ReadOnlyInput
                      label="Expected Reason"
                      value={entry.reason}
                    />

                    {/* Audio */}
                    <div className="flex flex-col gap-2 w-full">
                      <label className="text-[14px] font-semibold text-gray-900">
                        Audio/Video
                      </label>
                      <div className="w-full bg-[#F9FAFB] border border-gray-200 text-gray-600 text-[15px] rounded-md px-4 py-3 min-h-[46px] flex items-center justify-between shadow-sm">
                        <span>{entry.audio}</span>
                        <div className="flex gap-3 text-gray-400">
                          <Play
                            size={18}
                            className="cursor-pointer hover:text-blue-600 fill-current"
                          />
                          <Download
                            size={18}
                            className="cursor-pointer hover:text-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4 & 5 */}
                  <ReadOnlyInput
                    label="Solution Given"
                    value={entry.solution}
                  />
                  <ReadOnlyInput
                    label="Learning Outcome"
                    value={entry.learning}
                  />

                  {/* Separator inside card if needed */}
                  {entryIndex < dept.entries.length - 1 && (
                    <hr className="border-gray-100 mt-8 " />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PSLPage;
