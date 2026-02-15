import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Phone as PhoneIcon,
} from "lucide-react";

const ExecutiveCard = ({ executive, onClick }) => {
  const {
    name,
    photo,
    email,
    phone,
    designationId,
    departmentId,
    workLocation,
  } = executive;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
    >
      {/* Image Section */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
        {photo?.url ? (
          <img
            src={photo.url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">
                {name?.charAt(0) || "E"}
              </div>
              <p className="text-white text-sm mt-2">No Photo</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
          {name}
        </h3>

        {/* Designation */}
        {designationId?.name && (
          <p className="text-sm text-purple-600 font-semibold mb-3">
            {designationId.name}
          </p>
        )}

        {/* Department */}
        {departmentId?.name && (
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
            <Briefcase size={14} />
            <span className="truncate">{departmentId.name}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2">
          {email && (
            <div className="flex items-center gap-2 text-xs text-gray-600 truncate">
              <Mail size={14} className="flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <PhoneIcon size={14} className="flex-shrink-0" />
              <span>{phone}</span>
            </div>
          )}

          {workLocation && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin size={14} className="flex-shrink-0" />
              <span>{workLocation}</span>
            </div>
          )}
        </div>

        {/* View Profile Button */}
        <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-lg font-medium text-sm hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ExecutiveCard;
