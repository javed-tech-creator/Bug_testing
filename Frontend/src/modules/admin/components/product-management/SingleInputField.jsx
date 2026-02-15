import React from "react";

export default function SingleInputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  const handleChange = (e) => {
    let val = e.target.value;

    // If type is number → apply validation
    if (type === "number") {
      //  Not allowed: alphabets, symbols, spaces
      if (!/^\d*$/.test(val)) return;

      // Convert to number if not empty
      if (val !== "") {
        const num = Number(val);

        //  Not allowed: negative numbers or NaN
        if (isNaN(num) || num < 0) return;

        onChange(num); // return number only
      } else {
        onChange(""); // allow empty
      }

      return;
    }

    // Normal text input
    onChange(val);
  };

  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <input
        type="text" // always text to avoid browser issues
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border p-2 rounded-lg bg-white"
        inputMode={type === "number" ? "numeric" : undefined}
      />
    </div>
  );
}
