import React, { useState } from "react";
import { Phone, Mail, Star, TrendingUp, CalendarCheck } from "lucide-react";
import { User, FileText, Home } from "lucide-react";
export default function ExecutiveProfile() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          {/* PROFILE CARD */}
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"></div>

            <div className="flex flex-col items-center -mt-17 pb-6">
              <img
                src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc"
                alt="profile"
                className="w-30 h-30 rounded-full border-4 border-white object-cover"
              />

              <h2 className="mt-3 text-lg font-semibold text-indigo-700">
                Satya Prakash Yadav
              </h2>

              <p className="text-sm text-gray-500">ID: EMP25001</p>

              <span className="mt-2 px-4 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 font-medium">
                • Full-Time
              </span>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="bg-white rounded-md shadow p-2 space-y-1">
            <SidebarItem
              icon={<User size={18} />}
              label="Overview"
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />

            <SidebarItem
              icon={<FileText size={18} />}
              label="Personal Info"
              active={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
            />

            <SidebarItem
              icon={<Home size={18} />}
              label="Address"
              active={activeTab === "address"}
              onClick={() => setActiveTab("address")}
            />

            <SidebarItem
              icon={<CalendarCheck size={18} />}
              label="Attendance & Leave"
              active={activeTab === "attendance"}
              onClick={() => setActiveTab("attendance")}
            />

            <SidebarItem
              icon={<TrendingUp size={18} />}
              label="Performance"
              active={activeTab === "performance"}
              onClick={() => setActiveTab("performance")}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">
          {activeTab === "overview" && <OverviewSection />}
          {activeTab === "personal" && <PersonalInfo />}
          {activeTab === "address" && <AddressInfo />}
          {activeTab === "attendance" && <AttendanceLeave />}
          {activeTab === "performance" && <Performance />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer
      ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
          : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 bg-gray-100"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-sm border border-indigo-100 px-6 py-4 text-center">
      <p className="text-indigo-600 text-sm font-medium">{title}</p>
      <h2 className="text-2xl font-bold mt-2 text-indigo-800">{value}</h2>
    </div>
  );
}

function OverviewSection() {
  return (
    <>
      <div className="bg-white rounded-md shadow p-6 space-y-8 border-l-4 border-indigo-500">
        <h2 className="text-xl font-semibold mb-6">Employee Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-10">
          <Info label="Employee ID" value="EMP25001" />
          <Info label="Name" value="Satya Prakash Yadav" />
          <Info label="Department" value="Recce" />
          <Info label="Employee Type" value="Full-Time" />
          <Info label="Phone" value="9876543210" />
          <Info label="Gender" value="Male" />
          <Info label="City" value="Lucknow" />
          <Info label="State" value="Uttar Pradesh" />
          <Info label="Country" value="India" />
          <Info label="Joining Date" value="19/11/2025" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-5">
        <StatCard title="Projects" value="12" />
        <StatCard title="Leaves Taken" value="5" />
        <StatCard title="Pending Tasks" value="3" />
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 mt-5">
        <h3 className="text-lg font-semibold mb-3">About</h3>
        <p className="text-gray-700 leading-relaxed">
          <b>Satya Prakash Yadav</b> is a full-time employee in the Recce
          department, currently onboarding and actively contributing to internal
          projects. He joined the company on{" "}
          <span className="font-medium">19/11/2025</span> and has shown
          excellent performance in early tasks.
        </p>
      </div>
    </>
  );
}

function PersonalInfo() {
  return (
    <div className="space-y-6">
      {/* BASIC & CONTACT INFORMATION */}
      <SectionCard title="Basic & Contact Information">
        <TwoColInfo
          left={[
            { label: "Candidate ID", value: "email@example.com" },
            { label: "Email", value: "john@example.com" },
            { label: "Phone", value: "9876543210" },
            { label: "WhatsApp", value: "9876543210" },
            {
              label: "Gender",
              value: <Tag text="Male" color="blue" />,
            },
          ]}
          right={[
            { label: "Name", value: "John Doe updated today" },
            { label: "Work Email", value: "john.work@example.com" },
            { label: "Alternate Number", value: "9876543210" },
            { label: "Date of Birth", value: "13/10/2025" },
          ]}
        />
      </SectionCard>

      {/* PROFESSIONAL DETAILS */}
      <SectionCard title="Professional Details">
        <TwoColInfo
          left={[
            { label: "Joining Date", value: "19/11/2025" },
            {
              label: "Work Location",
              value: <Tag text="Remote" color="purple" />,
            },
            { label: "Marital Status", value: "Single" },
          ]}
          right={[
            {
              label: "Employee Type",
              value: <Tag text="Part-time" color="green" />,
            },
            { label: "Qualification", value: "Qualification" },
            { label: "Blood Group", value: "O-" },
          ]}
        />
      </SectionCard>

      {/* IDENTIFICATION */}
      <SectionCard title="Identification">
        <TwoColInfo
          left={[
            { label: "Aadhar Number", value: "N/A" },
            { label: "Passport Number", value: "N/A" },
          ]}
          right={[{ label: "PAN Number", value: "N/A" }]}
        />
      </SectionCard>

      {/* EMERGENCY CONTACT */}
      <SectionCard title="Emergency Contact">
        <TwoColInfo
          left={[
            { label: "Contact Name", value: "Name" },
            { label: "Phone", value: "9876543212" },
          ]}
          right={[{ label: "Relationship", value: "Relation" }]}
        />
      </SectionCard>
    </div>
  );
}

function AddressInfo() {
  return (
    <div className="space-y-6">
      {/* CURRENT ADDRESS */}
      <div className="bg-white rounded-lg shadow border-l-4 border-indigo-500 p-6">
        <h3 className="text-lg font-semibold mb-4">Current Address</h3>

        <Info label="Address" value="Gomti Nagar, Lucknow, Uttar Pradesh" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Info label="City" value="Lucknow" />
          <Info label="State" value="Uttar Pradesh" />
          <Info label="Country" value="India" />
        </div>
      </div>

      {/* PERMANENT ADDRESS */}
      <div className="bg-white rounded-lg shadow border-l-4 border-indigo-500 p-6">
        <h3 className="text-lg font-semibold mb-4">Permanent Address</h3>

        <Info label="Address" value="Azamgarh, Uttar Pradesh, India" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Info label="City" value="Azamgarh" />
          <Info label="State" value="Uttar Pradesh" />
          <Info label="Country" value="India" />
        </div>
      </div>
    </div>
  );
}

function AttendanceLeave() {
  return (
    <div className="bg-white rounded-lg shadow border-l-4 border-indigo-500 p-6">
      <h2 className="text-xl font-semibold mb-4">Attendance & Leave</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Info label="Total Leaves" value="12" />
        <Info label="Leaves Taken" value="5" />
        <Info label="Remaining" value="7" />
      </div>
    </div>
  );
}

function Performance() {
  return (
    <div className="bg-white rounded-lg shadow border-l-4 border-indigo-500 p-6">
      <h2 className="text-xl font-semibold mb-4">Performance</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Info label="Rating" value="4.8 / 5" />
        <Info label="Completed Projects" value="92" />
        <Info label="Active Projects" value="24" />
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow border-l-4 border-indigo-500 p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
function TwoColInfo({ left = [], right = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
      <div className="space-y-4 ">
        {left.map((item, i) => (
          <InfoRow key={i} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="space-y-4">
        {right.map((item, i) => (
          <InfoRow key={i} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}
function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}

function Tag({ text, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}
    >
      {text}
    </span>
  );
}
