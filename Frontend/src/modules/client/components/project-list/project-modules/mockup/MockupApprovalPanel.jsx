  // Fallback loading state since API is commented out
  const actionLoading = false;
import { useState } from "react";
import { toast } from "react-toastify";



// API commented out. Using dummy data only.
// const data = [];
const isLoading = false;

const dummyMockup = {
  _id: "mockup-demo",
  versions: [
    {
      _id: "v1",
      version_name: "Version 1",
      designer_note: "Initial layout proposal.",
    },
    {
      _id: "v2",
      version_name: "Version 2",
      designer_note: "Logo size increased and lighting adjusted.",
    },
  ],
};


export default function MockupApprovalPanel() {

  const mockup = dummyMockup;

  const [activeVersion, setActiveVersion] = useState(
    mockup.versions[0]
  );
  const [remark, setRemark] = useState("");

  const submitAction = async (status) => {
    try {
      const formData = new FormData();
      formData.append("mockup_id", mockup._id);
      formData.append("version_id", activeVersion._id);
      formData.append("client_status", status);
      formData.append("client_remark", remark || "");

      // Simulate API call since clientAction is not defined
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Action submitted successfully");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {/* Versions */}
      <div className="flex gap-2 flex-wrap">
        {mockup.versions.map((v) => (
          <button
            key={v._id}
            onClick={() => setActiveVersion(v)}
            className={`px-3 py-1 rounded-md border ${
              activeVersion._id === v._id
                ? "bg-blue-600 text-white"
                : ""
            }`}
          >
            {v.version_name}
          </button>
        ))}
      </div>

      {/* Notes */}
      <div className="border rounded-lg p-3 text-sm">
        <p className="font-medium">Designer Notes</p>
        <p className="text-gray-600">
          {activeVersion.designer_note}
        </p>
      </div>

      {/* Remark */}
      <textarea
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Add remark (optional)"
        className="w-full border rounded-md p-2 text-sm"
      />

      {/* Actions */}
      <div className="flex gap-3">
        <button
          disabled={actionLoading}
          onClick={() => submitAction("approved")}
          className="flex-1 bg-green-600 text-white py-2 rounded-md"
        >
          ✔ Approve
        </button>

        <button
          disabled={actionLoading}
          onClick={() => {
            if (!remark) {
              toast.error("Remark required");
              return;
            }
            submitAction("modification");
          }}
          className="flex-1 border py-2 rounded-md"
        >
          ✎ Request Changes
        </button>
      </div>
    </div>
  );
}
