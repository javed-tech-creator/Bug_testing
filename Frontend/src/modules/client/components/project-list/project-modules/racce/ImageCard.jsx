export default function ImageCard({ label, onClick, imageSrc }) {
  return (
    <div className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all" onClick={onClick}>
      <img 
        src={imageSrc} 
        alt={label}
        className="h-32 w-full object-cover hover:scale-105 transition-transform"
      />
      <div className="bg-green-600 text-white text-xs px-2 py-1">
        {label}
      </div>
    </div>
  )
}
