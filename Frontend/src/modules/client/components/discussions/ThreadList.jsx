import React, { useState } from 'react'

// Export threadsData so ChatWindow can use it
export const threadsData = [
  {
    id: 0,
    name: "Amit Singh",
    role: "Design",
    message: "Hi! I've uploaded the revised concepts...",
    time: "10:42 AM",
  },
  {
    id: 1,
    name: "Anup Singh",
    role: "Installation",
    message: "Team will arrive on Monday at 9 AM...",
    time: "10:42 AM",
  },
  {
    id: 2,
    name: "Akash Gupta",
    role: "Sales",
    message: "Invoice #204 has been processed. Thanks!",
    time: "10:42 AM",
  },
]

const roleColors = {
  Design: "bg-blue-100 text-blue-600",
  Installation: "bg-orange-100 text-orange-600",
  Sales: "bg-green-100 text-green-600",
}

const ThreadList = ({ selectedThread, onSelectThread }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredThreads = threadsData.filter(thread => 
    thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  console.log('ThreadList - Selected Thread:', selectedThread)

  return (
    <div className="w-80 border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-3">Discussions</h2>
        <input
          type="text"
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No threads found
          </div>
        ) : (
          filteredThreads.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                console.log('Clicking thread:', t.id, t.name)
                onSelectThread(t.id)
              }}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedThread === t.id ? "border-l-4 border-blue-600 bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-sm">{t.name}</h3>
                <span className="text-xs text-gray-400">{t.time}</span>
              </div>

              <p className="text-xs text-gray-500 mt-1 truncate">
                {t.message}
              </p>

              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${roleColors[t.role]}`}
              >
                {t.role}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ThreadList