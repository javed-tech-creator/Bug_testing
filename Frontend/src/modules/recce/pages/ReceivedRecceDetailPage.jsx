import React, { useEffect, useState } from "react";
import { ArrowLeft, Rocket, X, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

/* ===================== REUSABLE ===================== */

const SectionTitle = ({ title }) => (
  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200 uppercase tracking-wide">
    {title}
  </h3>
);

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
    {children}
  </label>
);

const Input = ({ value, type = "text", className = "" }) => (
  <input
    type={type}
    value={value || ""}
    readOnly
    className={`w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 bg-gray-50 text-gray-800 cursor-not-allowed ${className}`}
  />
);

const TextArea = ({ value, rows = 3 }) => (
  <textarea
    value={value || ""}
    rows={rows}
    readOnly
    className="w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 bg-gray-50 text-gray-800 resize-none cursor-not-allowed"
  />
);

const InfoBox = ({ title, items }) => (
  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
    <h4 className="text-sm font-bold text-gray-800 mb-3">{title}</h4>
    <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

const FileBadge = ({ name, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
  >
    <Eye size={16} />
    {name}
  </button>
);

/* ===================== STATIC DATA (UNCHANGED) ===================== */

const STATIC_DATA = {
  client: {
    clientCode: "CL-1001",
    clientName: "GreenFields Pvt Ltd",
    clientDesignation: "Manager",
    companyName: "GreenFields",
    mobileNumber: "9876543210",
    whatsappNumber: "9876543210",
    alternateNumber: "9123456780",
    email: "contact@greenfields.com",
    salesExecutive: "Amit Verma",
    lead: "Retail",
    deal: "Branding",
    relationship: "Neha Kapoor",
  },
  contact: {
    person: "Rakesh Patel",
    designation: "Owner",
    contactNumber: "9876543210",
    alternateNumber: "9123456780",
  },
  project: {
    projectName: "Retail Store Branding",
    projectCode: "PRJ-101",
    assignedDate: "15 Jan 2025",
    finalRecceConfirmation: "Pending",
    clientRequirement:
      "High visibility signage with durable outdoor material.",
    clientExpectation:
      "Premium finish with strong night visibility and clean installation.",
  },
  site: {
    address: "24, High Street, Andheri West, Mumbai",
    location: "19.1197,72.8468",
  },
  instructions: {
    client: ["Bright night visibility", "Bold lettering"],
    sales: ["Take marking photos", "Confirm color shade"],
    site: ["Electrical wiring nearby", "High footfall area"],
  },
  assets: [{ name: "Design.pdf" }, { name: "Brand_Guidelines.pdf" }],
  products: [
    {
      id: "1",
      productName: "LED Sign Board",
      productCode: "LED-001",
      quantity: 2,
      status: "New Recce",
    },
    {
      id: "2",
      productName: "ACP Signage",
      productCode: "ACP-002",
      quantity: 1,
      status: "New Recce",
    },
  ],
};

/* ===================== PAGE ===================== */

const ReceivedRecceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assetModal, setAssetModal] = useState(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-3 border-b">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">
          Recce Details
        </h1>
      </div>

      <div className="py-3 space-y-3">

        {/* BASIC CLIENT INFO */}
        <div className="bg-white p-5 rounded-lg border">
          <SectionTitle title="Basic Client Information" />
          <div className="grid grid-cols-4 gap-6">
            <div><Label>Client Code</Label><Input value={STATIC_DATA.client.clientCode} /></div>
            <div><Label>Client Name</Label><Input value={STATIC_DATA.client.clientName} /></div>
            <div><Label>Client Designation</Label><Input value={STATIC_DATA.client.clientDesignation} /></div>
            <div><Label>Company Name</Label><Input value={STATIC_DATA.client.companyName} /></div>
            <div><Label>Mobile Number</Label><Input value={STATIC_DATA.client.mobileNumber} /></div>
            <div><Label>WhatsApp Number</Label><Input value={STATIC_DATA.client.whatsappNumber} /></div>
            <div><Label>Alternate Number</Label><Input value={STATIC_DATA.client.alternateNumber} /></div>
            <div><Label>Email</Label><Input value={STATIC_DATA.client.email} /></div>
            <div><Label>Sales Executive</Label><Input value={STATIC_DATA.client.salesExecutive} /></div>
            <div><Label>Lead</Label><Input value={STATIC_DATA.client.lead} /></div>
            <div><Label>Deal</Label><Input value={STATIC_DATA.client.deal} /></div>
            <div><Label>Relationship</Label><Input value={STATIC_DATA.client.relationship} /></div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="bg-white p-5 rounded-lg border">
          <SectionTitle title="Contact Person Details (On Site)" />
          <div className="grid grid-cols-4 gap-6">
            <div><Label>Contact Person</Label><Input value={STATIC_DATA.contact.person} /></div>
            <div><Label>Designation</Label><Input value={STATIC_DATA.contact.designation} /></div>
            <div><Label>Contact Number</Label><Input value={STATIC_DATA.contact.contactNumber} /></div>
            <div><Label>Alternate Number</Label><Input value={STATIC_DATA.contact.alternateNumber} /></div>
          </div>
        </div>

        {/* PROJECT */}
        <div className="bg-white p-5 rounded-lg border">
          <SectionTitle title="Project Information" />
          <div className="grid grid-cols-4 gap-6">
            <div><Label>Project Name</Label><Input value={STATIC_DATA.project.projectName} /></div>
            <div><Label>Project Code</Label><Input value={STATIC_DATA.project.projectCode} /></div>
            <div><Label>Assigned Date</Label><Input value={STATIC_DATA.project.assignedDate} /></div>
            <div><Label>Final Recce Confirmation</Label><Input value={STATIC_DATA.project.finalRecceConfirmation} /></div>
          </div>
        </div>

        {/* SITE */}
        <div className="bg-white p-5 rounded-lg border">
          <SectionTitle title="Site Address" />
          <Label>Full Address</Label>
          <TextArea value={STATIC_DATA.site.address} />
          <div className="mt-4 h-48 border rounded-lg overflow-hidden">
            <iframe
              title="map"
              width="100%"
              height="100%"
              src={`https://www.google.com/maps?q=${STATIC_DATA.site.location}&output=embed`}
            />
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="bg-white p-5 rounded-lg border">
          <SectionTitle title="Instructions" />
          <div className="grid grid-cols-3 gap-6">
            <InfoBox title="Client Instructions" items={STATIC_DATA.instructions.client} />
            <InfoBox title="Sales Instructions" items={STATIC_DATA.instructions.sales} />
            <InfoBox title="Site Warnings" items={STATIC_DATA.instructions.site} />
          </div>
        </div>

        {/* ASSETS */}
        <div className="bg-white p-5 rounded-lg border">
          <SectionTitle title="Design Assets Provided by Sales" />
          <div className="flex flex-wrap gap-3">
            {STATIC_DATA.assets.map((a, i) => (
              <FileBadge key={i} name={a.name} onClick={() => setAssetModal(a.name)} />
            ))}
          </div>
        </div>

        {/* PRODUCT SECTION */}
        <div className="bg-white p-5 rounded-lg border">
          <SectionTitle title="Product Section (From Sales Team)" />

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div><Label>Client Requirement</Label><TextArea value={STATIC_DATA.project.clientRequirement} /></div>
            <div><Label>Client Expectation</Label><TextArea value={STATIC_DATA.project.clientExpectation} /></div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3">S.No</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Product Code</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {STATIC_DATA.products.map((p, i) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-3 text-center">{i + 1}</td>
                    <td className="p-3">{p.productName}</td>
                    <td className="p-3 text-center">{p.productCode}</td>
                    <td className="p-3 text-center">{p.quantity}</td>
                    <td className="p-3 text-center">
                      <span className="px-3 py-1 text-xs bg-gray-200 rounded">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ASSET MODAL */}
      {assetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">{assetModal}</h3>
              <button onClick={() => setAssetModal(null)}>
                <X />
              </button>
            </div>
            <div className="h-40 flex items-center justify-center bg-gray-100">
              Previewing: {assetModal}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedRecceDetailPage;
