export default function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
      <div className="px-4 py-3 font-semibold text-gray-800 border-b border-gray-200">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
