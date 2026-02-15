import React, { useState } from "react";
import {
  Users,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* ================= STATIC DUMMY DATA ================= */

const quotationSummary = {
  quotationExecutive: 3,
  totalQuotations: 8,
};

const quotationMembers = [
  {
    id: 1,
    name: "Amit Singh",
    sites: [
      {
        siteName: "Warehouse Complex A",
        location: "Industrial Area, Lucknow",
        time: 3,
        status: "completed",
        remark: "Quotation shared with client",
      },
      {
        siteName: "Retail Store C",
        location: "Shopping Mall, Lucknow",
        time: 2,
        status: "progress",
        remark: "Costing in progress",
      },
    ],
  },
  {
    id: 2,
    name: "Priya Sharma",
    sites: [
      {
        siteName: "Commercial Space B",
        location: "Business Park, Lucknow",
        time: 4,
        status: "completed",
        remark: "Client approval pending",
      },
    ],
  },
  {
    id: 3,
    name: "Rahul Verma",
    sites: [
      {
        siteName: "Office Tower D",
        location: "Gomti Nagar, Lucknow",
        time: 3,
        status: "incomplete",
        remark: "BOQ details missing",
      },
    ],
  },
];

/* ================= HELPERS ================= */

const getStatusIcon = (status) => {
  if (status === "completed")
    return <CheckCircle2 className="w-4 h-4 text-green-600" />;
  if (status === "incomplete")
    return <XCircle className="w-4 h-4 text-red-600" />;
  return <Clock className="w-4 h-4 text-amber-600" />;
};

/* ================= COMPONENT ================= */

function EveningQuotationTeam({ onDataChange }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    const newSelectedUser = selectedUser?.id === user.id ? null : user;
    setSelectedUser(newSelectedUser);
    
    // Pass team data back to parent
    if (onDataChange) {
      onDataChange({
        selectedUser: newSelectedUser,
        summary: quotationSummary,
        allMembers: quotationMembers,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= TOP SUMMARY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border-t-4 border-black rounded-md shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-600 text-sm">Quotation Executive</div>
              <div className="text-2xl font-bold">
                {quotationSummary.quotationExecutive}
              </div>
            </div>
            <div className="p-2 bg-black rounded-md">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white border-t-4 border-black rounded-md shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-gray-600 text-sm">Total Quotations</div>
              <div className="text-2xl font-bold">
                {quotationSummary.totalQuotations}
              </div>
            </div>
            <div className="p-2 bg-black rounded-md">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TEAM MEMBERS ================= */}
      <div className="bg-white border rounded-md p-4">
        <h3 className="font-medium mb-3">Team Members</h3>

        <div className="space-y-2">
          {quotationMembers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`cursor-pointer border rounded-md px-3 py-2 transition ${
                selectedUser?.id === user.id
                  ? "border-black bg-gray-50"
                  : "hover:bg-gray-50"
              }`}
            >
              {user.name}
            </div>
          ))}
        </div>
      </div>

      {/* ================= USER DETAILS ================= */}
      {selectedUser && (
        <div className="bg-white border rounded-md p-4">
          <h3 className="font-semibold mb-3">
            {selectedUser.name} – Evening Quotation Report
          </h3>

          <div className="space-y-3">
            {selectedUser.sites.map((site, idx) => (
              <div key={idx} className="border rounded-md p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(site.status)}
                  <div className="font-medium">{site.siteName}</div>
                </div>

                <div className="text-sm text-gray-500">{site.location}</div>

                <div className="mt-2 text-sm">
                  <span className="text-gray-500">Time:</span> {site.time}h
                </div>

                <div className="mt-1 text-sm">
                  <span className="text-gray-500">Status:</span>{" "}
                  <span className="capitalize">{site.status}</span>
                </div>

                {site.remark && (
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Remark:</span> {site.remark}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EveningQuotationTeam;
