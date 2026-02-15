export  const InfoField = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
    <div className="bg-gray-100 border rounded-sm px-3 py-2 text-sm text-gray-700">
      {value || "-"}
    </div>
  </div>
);
