const people = [
  {
    name: "Priya Sharma",
    role: "Sales Manager",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Arjun Mehta",
    role: "Head of Customer Relations",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Mr. Alok Mishra",
    role: "General Manager",
    avatar: "https://i.pravatar.cc/100?img=13",
  },
]

export default function EscalationMatrix() {
  return (
    <div className="bg-white border rounded-lg p-5 h-fit">
      <h3 className="font-semibold text-lg mb-2">
        Escalation Matrix
      </h3>

      <p className="text-sm text-gray-500 mb-4">
        Your concern will be immediately notified to our leadership team.
      </p>

      <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-600 mb-5 rounded">
        We are committed to resolving critical issues within 24 hours.
      </div>

      <div className="space-y-4">
        {people.map((p) => (
          <div key={p.name} className="flex items-center gap-3">
            <img
              src={p.avatar}
              alt={p.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">{p.role}</p>
              <p className="text-xs text-gray-500">{p.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
