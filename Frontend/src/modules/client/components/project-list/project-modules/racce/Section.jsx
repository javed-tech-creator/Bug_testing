export default function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
