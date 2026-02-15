import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";

const ReviewModal = ({ isOpen, onClose, title, remark, onSave }) => {
  const [editedRemark, setEditedRemark] = useState("");
  const [rating, setRating] = useState(4);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setEditedRemark(remark || "");
    }
  }, [isOpen, remark]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        remark: editedRemark,
        rating: rating,
      });
    }
    onClose();
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-white rounded-md shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {title || "Client Details Section Review"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4">
          {/* Accuracy Score Section */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800">
              Accuracy Score
            </label>
            <div className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-200 rounded-lg">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={`cursor-pointer transition-colors ${
                      star <= (hoveredStar || rating)
                        ? "fill-orange-400 text-orange-400"
                        : "fill-gray-400 text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-500 font-medium">{rating}/5</span>
            </div>
          </div>

          {/* Remark Section */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800">
              Remark
            </label>
            <textarea
              value={editedRemark}
              onChange={(e) => setEditedRemark(e.target.value)}
              placeholder="Enter your remark here..."
              className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-lg min-h-[100px] text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
