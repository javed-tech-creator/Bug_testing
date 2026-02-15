const InfoField = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
    <div className="bg-gray-50 border rounded-md px-3 py-2 text-sm">
      {value || "-"}
    </div>
  </div>
);

const ToggleBadge = ({ value, active }) => (
  <div
    className={`px-4 py-2 rounded-md text-sm font-medium border ${
      active
        ? "bg-blue-100 text-blue-600 border-blue-200"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    {value}
  </div>
);

const ClientInteraction = ({clientInteractionData}) => {
  const d = clientInteractionData;

  return (
    <div className="bg-white border rounded-md shadow-sm">
      {/* HEADER */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">Client Interaction</h2>
      </div>

      <div className="p-4 space-y-4">
        {/* YES / NO */}
        <div>
          <p className="text-sm font-medium mb-2">Met Client on Site?</p>
          <div className="flex gap-3">
            <ToggleBadge value="Yes" active={d.metOnSite === "Yes"} />
            <ToggleBadge value="No" active={d.metOnSite === "No"} />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Person Met" value={d.personMet} />
          <InfoField label="Contact Number" value={d.contactNumber} />
        </div>

        <InfoField
          label="Reason for Not Meeting"
          value={d.reasonForNotMeeting}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Suggest Reschedule Date" value={d.rescheduleDate} />
          <InfoField label="Upload Proof Image" value={d.proofImage} />
        </div>
      </div>
    </div>
  );
};

export default ClientInteraction;
