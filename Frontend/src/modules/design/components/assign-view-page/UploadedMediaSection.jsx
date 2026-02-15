import { Play } from "lucide-react";

export const MediaCard = ({ image, label }) => (
  <div className="border rounded-sm overflow-hidden bg-gray-50">
    <img
      src={image}
      alt={label}
      className="w-full h-36 object-cover p-2"
    />

    <div className="px-2 py-1 text-xs text-blue-600 font-medium flex items-center gap-1">
      📷 {label}
    </div>
  </div>
);

export const VideoCard = ({ image, label }) => (
  <div className="border rounded-sm overflow-hidden bg-gray-50 relative">
    <img
      src={image}
      alt={label}
      className="w-full h-36 object-cover"
    />

    {/* Play Icon */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow">
        <Play size={18} className="text-blue-600" />
      </div>
    </div>

    <div className="px-2 py-1 text-xs text-blue-600 font-medium flex items-center gap-1">
      🎥 {label}
    </div>
  </div>
);
