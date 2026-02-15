import React from "react";
import { ClipboardList, Upload, CheckCircle } from "lucide-react";

const UploadStatusIcon = ({ status, onClick, disabled = false }) => {
  // Status can be: "not_started", "started", "uploaded"
  
  const getIconConfig = () => {
    switch (status) {
      case "not_started":
        return {
          Icon: ClipboardList,
          bgColor: "bg-gray-600 hover:bg-gray-700",
          title: "Start Upload Process",
          label: "Start",
        };
      case "started":
        return {
          Icon: Upload,
          bgColor: "bg-orange-600 hover:bg-orange-700",
          title: "Upload Files",
          label: "Upload",
        };
      case "uploaded":
        return {
          Icon: CheckCircle,
          bgColor: "bg-green-600 hover:bg-green-700",
          title: "Files Uploaded",
          label: "Completed",
        };
      default:
        return {
          Icon: ClipboardList,
          bgColor: "bg-gray-600 hover:bg-gray-700",
          title: "Start Upload Process",
          label: "Start",
        };
    }
  };

  const { Icon, bgColor, title, label } = getIconConfig();

  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled || status === "uploaded"}
      className={`${bgColor} text-white p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Icon size={16} />
    </button>
  );
};

export default UploadStatusIcon;