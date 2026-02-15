import UsersTable from "../../components/access-controls/UsersTable"
import DataIsolationBanner from "../../components/access-controls/DataIsolationBanner"

export default function UserAccess() {
  return (
    <div className="">

      {/* Header */}
      <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
        {/* <button className="text-xl">←</button> */}
        <div>
          <h1 className="text-lg font-semibold">User Access & Security</h1>
          <p className="text-sm text-gray-500">
            Manage login methods, user roles, and data permissions.
          </p>
        </div>
      </div>

      {/* Table */}
      <UsersTable />

      {/* Policy */}
      <DataIsolationBanner />
    </div>
  )
}
