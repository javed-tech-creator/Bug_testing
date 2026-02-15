import React, { useState } from "react";

export function Tabs({ defaultValue, onValueChange, children }) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue) => {
    setValue(newValue);
    onValueChange && onValueChange(newValue);
  };

  // Clone children and inject current value
  return (
    <div className="space-y-2">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          currentValue: value,
          onValueChange: handleChange,
        })
      )}
    </div>
  );
}

export function TabsList({ children }) {
  return <div className="flex gap-3 border-b">{children}</div>;
}

export function TabsTrigger({ value, currentValue, onValueChange, children }) {
  const isActive = currentValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 -mb-px border-b-2 transition ${
        isActive
          ? "border-blue-600 text-blue-600 font-semibold"
          : "border-transparent text-gray-600 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}
