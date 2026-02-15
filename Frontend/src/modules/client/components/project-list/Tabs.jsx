const tabs = ["All Projects", "Active", "Pending", "Completed", "Lost"]

export default function Tabs({ activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-4 ml-6 text-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onFilterChange(tab)}
          className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
            activeFilter === tab
              ? "bg-blue-100 text-blue-600 font-medium"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
