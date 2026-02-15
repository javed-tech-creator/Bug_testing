export default function ProjectHeader() {
  return (
    <div className="bg-white border rounded-lg p-4">

      {/* Top Row */}
      <div className="flex flex-wrap justify-between items-center gap-4">

        <div className="mt-3">
          <div className="flex">
            <h2 className="text-lg font-semibold">HQ Signage Revamp</h2>
            <span className="bg-blue-600 text-white text-[10px] px-3 py-2 rounded-full ml-2">
              Current Stage: Design
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            Project Code: DSS-24-104 • Location: New York, NY
          </p>
        </div>



        {/* Stats */}
        <div className="flex gap-3">
          <StatBox color="orange" title="45%" subtitle="Progress" />
          <StatBox color="green" title="18" subtitle="Products" />
          <StatBox color="red" title="Oct 24" subtitle="Deadline" />
        </div>

      </div>
    </div>
  )
}

function StatBox({ color, title, subtitle }) {
  const styles = {
    orange: "bg-orange-500",
    green: "bg-green-600",
    red: "bg-red-600",
  }

  return (
    <div className={`text-white px-4 py-2 rounded-lg text-center ${styles[color]}`}>
      <div className="font-semibold">{title}</div>
      <div className="text-xs">{subtitle}</div>
    </div>
  )
}
