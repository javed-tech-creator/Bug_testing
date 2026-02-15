
export function Button({ text, Icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-sm border border-blue-600 px-4 py-1 text-[12px] font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
    >
      {Icon && <Icon size={16} />}
      {text}
    </button>
  )
}
