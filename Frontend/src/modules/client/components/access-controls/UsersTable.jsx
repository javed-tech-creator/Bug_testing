const users = [
  {
    name: "Alex Morgan",
    email: "alex@example.com",
    role: "Owner",
    permission: "Full Access",
    lastActive: "Just now",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sarah Connor",
    email: "sarah@example.com",
    role: "Manager",
    permission: "View + Approvals",
    lastActive: "2 hours ago",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "David Chen",
    email: "david@example.com",
    role: "Accountant",
    permission: "Quotation / Invoice",
    lastActive: "1 day ago",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Marcus Johnson",
    email: "marcus@example.com",
    role: "Site In-charge",
    permission: "Recce / Installation",
    lastActive: "3 days ago",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
]

const roleBadge = {
  Owner: "bg-blue-100 text-blue-600",
  Manager: "bg-blue-100 text-blue-600",
  Accountant: "bg-blue-100 text-blue-600",
  "Site In-charge": "bg-blue-100 text-blue-600",
}

export default function UsersTable() {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">

      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
        Client Roles & Permissions
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Access Permissions</th>
              <th className="text-left p-3">Last Active</th>
              <th className="text-center p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${roleBadge[u.role]}`}>
                    {u.role}
                  </span>
                </td>

                <td className="p-3">{u.permission}</td>
                <td className="p-3">{u.lastActive}</td>

                <td className="p-3 text-center">
                  <Toggle />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Toggle() {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked />
      <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600" />
      <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5" />
    </label>
  )
}
