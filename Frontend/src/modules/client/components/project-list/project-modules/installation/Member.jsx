export default function Member({
  name,
  role,
  avatarSrc = "https://i.pravatar.cc/100?img=13"
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={avatarSrc}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
  )
}
