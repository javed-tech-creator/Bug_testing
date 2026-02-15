export default function DocumentCard({ title, count, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-lg p-6 flex flex-col items-center text-center hover:shadow transition cursor-pointer"
    >
      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl mb-3">
        {icon}
      </div>

      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">
        {count} File{count !== 1 && "s"}
      </p>
    </div>
  );
}
