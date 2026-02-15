export default function RoleCard({ title, desc , Icon}) {
  return (
    <div className="bg-white border rounded-lg p-4 flex gap-3">
      <div className="p-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
       {Icon && <Icon size={20} />}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  )
}
