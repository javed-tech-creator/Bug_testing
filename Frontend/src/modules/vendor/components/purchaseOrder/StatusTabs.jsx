import React, { useEffect, useState } from "react";

const tabs = [
  { label: "All Transactions", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Paid", value: "Paid" },
  { label: "Partial", value: "Partial" },
  { label: "Drafts", value: "Drafts" },
];

export default function StatusTabs({ onTabChange,filterStatus, orders = [],  }) {
  const [activeTab, setActiveTab] = useState("all");

  useEffect(()=>{
setActiveTab(filterStatus)
  },[filterStatus])

  const handleTabClick = (value) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  // ✅ Function to get count for each tab
  const getTabCount = (tabValue) => {
    if (tabValue === "all") return orders.length;
    if (tabValue === "Drafts") return orders.length;
    return orders.filter(
      (order) => order.paymentStatus?.toLowerCase() === tabValue.toLowerCase()
    ).length;
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-6 border-b border-gray-200 text-sm font-medium">
      {tabs.map((tab) => {
        const count = getTabCount(tab.value);

        return (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`relative pb-2 hover:text-blue-600 cursor-pointer transition ${
              activeTab === tab.value
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab.label}

            {/* ✅ Sirf active tab ka badge dikhana */}
            {activeTab === tab.value && count > 0 && (
              <span
                className={`ml-2 inline-flex items-center justify-center text-xs font-semibold rounded-full px-2 py-0.5 bg-blue-100 text-blue-800`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
