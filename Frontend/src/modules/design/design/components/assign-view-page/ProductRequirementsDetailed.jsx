export const Input = ({ label, value }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      readOnly
      value={value}
      className="w-full border rounded-md p-2 bg-gray-50"
    />
  </div>
);

export const Select = ({ label, value }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      disabled
      className="w-full border rounded-md p-2 bg-gray-50"
    >
      <option>{value}</option>
    </select>
  </div>
);

export const Dimension = ({ label, value, unit }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <div className="flex gap-2">
      <input
        readOnly
        value={value}
        className="flex-1 border rounded-md p-2 bg-gray-50"
      />
      <select
        disabled
        className="w-24 border rounded-md p-2 bg-gray-50"
      >
        <option>{unit}</option>
      </select>
    </div>
  </div>
);