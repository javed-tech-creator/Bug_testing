export default function DetailCard({ title, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-lg p-6 flex flex-col items-center text-center hover:shadow transition cursor-pointer"
    >
      <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
  )
}
