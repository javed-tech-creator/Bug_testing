export default function ImageSection({
  title,
  images = [
    "https://picsum.photos/seed/installation-01/600/400",
    "https://picsum.photos/seed/installation-02/600/400",
  ],
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`${title} ${index + 1}`}
            className="h-28 w-full object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  )
}
