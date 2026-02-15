 const InputField = ({
  label,
  keyName,
  type = "text",
  required = false,
  disabled = false,
  placeholder,
  value,
  onChange,
  error,
}) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-800 mb-1">
      {required && <span className="text-red-500 mr-1">*</span>}
      {label}
    </label>
    <input
      id={keyName}
      type={type}
      placeholder={placeholder || label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full rounded-lg px-4 py-2 text-gray-900 transition-all duration-200 border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        error ? "border-red-500" : "border-gray-300"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

export default InputField;