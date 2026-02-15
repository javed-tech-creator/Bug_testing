import React from "react";
import { FileText, CloudUpload, Star } from "lucide-react";

const ActivityFeed = () => {
  const data = [
    {
      icon: <FileText size={22} color="white" />,
      bg: "bg-green-500",
      title: "Recce Completed at XYZ",
      date: "Today",
    },
    {
      icon: <CloudUpload size={22} color="white" />,
      bg: "bg-pink-500",
      title: "Photo Uploaded",
      date: "29 October 2025",
    },
    {
      icon: <FileText size={22} color="white" />,
      bg: "bg-blue-600",
      title: "Report Submitted to TL",
      date: "28 October 2025",
    },
    {
      icon: <Star size={22} color="white" />,
      bg: "bg-yellow-500",
      title: "Feedback Received",
      date: "27 October 2025",
    },
    {
      icon: <FileText size={22} color="white" />,
      bg: "bg-green-500",
      title: "Recce Completed at Code Crafter",
      date: "22 October 2025",
    },
    // Extra data point to show scroll behavior
    {
      icon: <FileText size={22} color="white" />,
      bg: "bg-gray-500",
      title: "Older Activity",
      date: "20 October 2025",
    },
  ];

  return (
    /* Parent container height matching the map panel structure */
    <div className="border border-gray-300 rounded-xl bg-white p-4">
      <h2 className="text-2xl font-semibold mb-4">Activity Feed</h2>

      {/* Height set to 450px with scroll for internal content */}
      <div className="h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-5">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Icon Box */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div>
                <p className="text-md font-semibold leading-tight">{item.title}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;