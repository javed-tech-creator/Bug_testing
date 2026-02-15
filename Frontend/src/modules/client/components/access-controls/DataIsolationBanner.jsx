export default function DataIsolationBanner() {
  return (
    <div className="bg-green-50 border border-green-500 rounded-lg p-4 flex items-start gap-3">
      <div className="text-green-600 text-2xl">🛡️</div>
      <div>
        <h3 className="font-semibold text-green-700">
          Data Isolation Policy Active
        </h3>
        <p className="text-sm text-green-700 mt-1">
          ERP Rule: Clients can only access their own organization's data.
          Cross-access between client accounts is strictly restricted by the system kernel.
        </p>
      </div>
    </div>
  )
}
