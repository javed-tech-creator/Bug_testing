import Info from "./Info"
export default function ProductRecce({ title }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
        {title}
      </div>

      <div className="p-4 space-y-4 text-sm">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Info label="Dimensions" value="H: 14ft x W: 32ft" />
          <Info label="Surface Type" value="ACP Cladding (Drillable)" />
          <Info label="Mounting" value="Wall-mounted with chemical anchors" />
          <Info label="Power Access" value="Available – 10ft from center" />
        </div>

        <div>
          <p className="text-gray-500">Installation Notes</p>
          <p className="text-gray-700">
            Scaffolding required for 2nd floor height. Signage to be aligned with existing glass mullions.
            Night installation recommended to avoid traffic at main gate.
          </p>
        </div>

      </div>
    </div>
  )
}
